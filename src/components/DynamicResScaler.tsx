import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

// Configuration
const TARGET_FPS = 60;
const CHECK_INTERVAL = 500; // Check every 500ms
const FPS_TOLERANCE = 5; // Allow 55-65 FPS before adjusting
const MIN_DPR = 0.5;
const MAX_DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 1, 2) : 1;
const START_DPR = Math.min(MIN_DPR, MAX_DPR);
const STEP = 0.1;

type DynamicResScalerProps = {
  minDpr?: number;
  maxDpr?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type DprAdjustParams = {
  fps: number;
  currentDpr: number;
  minDpr: number;
  maxDpr: number;
  step: number;
  targetFps: number;
  fpsTolerance: number;
};

export function computeNextDpr({
  fps,
  currentDpr,
  minDpr,
  maxDpr,
  step,
  targetFps,
  fpsTolerance,
}: DprAdjustParams) {
  let next = currentDpr;

  if (fps < targetFps - fpsTolerance) {
    next = clamp(currentDpr - step, minDpr, maxDpr);
  } else if (fps > targetFps + fpsTolerance) {
    next = clamp(currentDpr + step, minDpr, maxDpr);
  }

  return next;
}

export function DynamicResScaler({ minDpr, maxDpr }: DynamicResScalerProps) {
  const setDpr = useThree((state) => state.setDpr);

  const deviceMaxDpr =
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 1, 2) : 1;
  const effectiveMaxDpr = clamp(maxDpr ?? MAX_DPR, MIN_DPR, deviceMaxDpr);
  const effectiveMinDpr = clamp(minDpr ?? MIN_DPR, MIN_DPR, effectiveMaxDpr);
  const initialDpr = clamp(START_DPR, effectiveMinDpr, effectiveMaxDpr);

  // Refs to store state without triggering re-renders for the logic loop
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const dprRef = useRef(initialDpr); // Start conservative to reduce GPU pressure within bounds

  // We'll just set the initial DPR once on mount to ensure we start at a known state
  useEffect(() => {
    setDpr(dprRef.current);
  }, [setDpr]);

  useFrame((_state) => {
    frameCount.current++;
    const time = performance.now();
    const elapsed = time - lastTime.current;

    if (elapsed >= CHECK_INTERVAL) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);

      // Reset counters
      frameCount.current = 0;
      lastTime.current = time;

      // Logic to adjust DPR
      const newDpr = computeNextDpr({
        fps,
        currentDpr: dprRef.current,
        minDpr: effectiveMinDpr,
        maxDpr: effectiveMaxDpr,
        step: STEP,
        targetFps: TARGET_FPS,
        fpsTolerance: FPS_TOLERANCE,
      });

      // Apply change if needed
      if (newDpr !== dprRef.current) {
        dprRef.current = newDpr;
        setDpr(newDpr);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DynamicResScaler] FPS: ${fps}, Adjusting DPR to: ${newDpr.toFixed(2)}`);
        }
      }
    }
  });

  return null;
}
