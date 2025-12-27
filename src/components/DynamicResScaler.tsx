import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

// Configuration
const TARGET_FPS = 60;
const CHECK_INTERVAL = 500; // Check every 500ms
const FPS_TOLERANCE = 5; // Allow 55-65 FPS before adjusting
const MIN_DPR = 0.5;
const MAX_DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
const STEP = 0.1;

export function DynamicResScaler() {
  const setDpr = useThree((state) => state.setDpr);
  
  // Refs to store state without triggering re-renders for the logic loop
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const dprRef = useRef(MAX_DPR); // Start at max quality

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
      let newDpr = dprRef.current;

      if (fps < TARGET_FPS - FPS_TOLERANCE) {
        // Performance is low, reduce resolution
        newDpr = Math.max(MIN_DPR, dprRef.current - STEP);
      } else if (fps > TARGET_FPS + FPS_TOLERANCE) {
        // Performance is good, increase resolution
        newDpr = Math.min(MAX_DPR, dprRef.current + STEP);
      }

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
