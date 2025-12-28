import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const frameCallbacks: Array<(state: unknown, delta: number) => void> = [];
const setDprSpy = vi.fn();

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: (state: unknown, delta: number) => void) => {
    frameCallbacks.push(cb);
  },
  useThree: (selector: (state: { setDpr: (dpr: number) => void }) => unknown) =>
    selector({ setDpr: setDprSpy }),
}));

import { DynamicResScaler } from '@/components/DynamicResScaler';

const runFrames = (count: number, delta = 1 / 60) => {
  const cb = frameCallbacks.at(-1);
  if (!cb) throw new Error('No useFrame callback registered');
  for (let i = 0; i < count; i++) cb({} as unknown, delta);
};

describe('DynamicResScaler', () => {
  const originalEnv = process.env.NODE_ENV;
  const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 1, 2) : 1;
  const startDpr = Math.min(1, maxDpr);

  beforeEach(() => {
    frameCallbacks.length = 0;
    setDprSpy.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it('sets initial DPR once on mount', () => {
    render(<DynamicResScaler />);
    expect(setDprSpy).toHaveBeenCalledTimes(1);
    expect(setDprSpy).toHaveBeenCalledWith(startDpr);
  });

  it('reduces DPR when FPS is consistently low (clamped)', () => {
    // Mount initializes lastTime=0
    let t = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => t);

    render(<DynamicResScaler />);
    expect(setDprSpy).toHaveBeenCalledWith(startDpr);

    // Drive multiple low-FPS intervals: 10 frames over 500ms => 20 FPS
    for (let step = 0; step < 10; step++) {
      // each iteration: advance time by 50ms per frame for 10 frames
      for (let i = 0; i < 10; i++) {
        t += 50;
        runFrames(1);
      }
    }

    // DPR should have decreased, but not below 0.5
    const calls = setDprSpy.mock.calls.map((c) => c[0] as number);
    expect(calls.at(-1)).toBeGreaterThanOrEqual(0.5);
    expect(calls.at(-1)).toBeLessThan(1);
  });

  it('increases DPR when FPS is high (up to MAX_DPR)', () => {
    // Force initial DPR down by simulating a low-FPS interval, then a high-FPS interval.
    let t = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => t);

    render(<DynamicResScaler />);

    // Low FPS interval to reduce DPR to 0.9
    for (let i = 0; i < 10; i++) {
      t += 50;
      runFrames(1);
    }

    const afterLow = setDprSpy.mock.calls.map((c) => c[0] as number).at(-1);
    expect(afterLow).toBeLessThan(1);

    // High FPS interval: 80 frames over 500ms => 160 FPS
    for (let i = 0; i < 80; i++) {
      t += 500 / 80;
      runFrames(1);
    }

    const afterHigh = setDprSpy.mock.calls.map((c) => c[0] as number).at(-1);
    expect(afterHigh).toBeGreaterThan(afterLow ?? 0);
    expect(afterHigh).toBeLessThanOrEqual(maxDpr);
  });

  it('logs DPR adjustments in development', () => {
    process.env.NODE_ENV = 'development';
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    let t = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => t);

    render(<DynamicResScaler />);
    // Trigger one low-FPS adjustment
    for (let i = 0; i < 10; i++) {
      t += 50;
      runFrames(1);
    }

    expect(logSpy).toHaveBeenCalled();
  });

  it('clamps DPR to provided minDpr when FPS stays low', () => {
    let t = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => t);

    render(<DynamicResScaler minDpr={0.8} maxDpr={1.2} />);

    // Drive several low-FPS intervals (20 FPS equivalent) to force multiple reductions.
    for (let step = 0; step < 6; step++) {
      for (let i = 0; i < 10; i++) {
        t += 50;
        runFrames(1);
      }
    }

    const calls = setDprSpy.mock.calls.map((c) => c[0] as number);
    expect(calls.length).toBeGreaterThan(0);
    const last = calls[calls.length - 1];
    expect(last).toBeGreaterThanOrEqual(0.8);
  });

  it('clamps DPR to provided maxDpr when FPS is high', () => {
    let t = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => t);

    render(<DynamicResScaler minDpr={0.5} maxDpr={0.9} />);

    // First drop DPR with low FPS to ensure we later ramp upward.
    for (let step = 0; step < 4; step++) {
      for (let i = 0; i < 10; i++) {
        t += 50;
        runFrames(1);
      }
    }

    const callsAfterLow = setDprSpy.mock.calls.map((c) => c[0] as number);
    expect(callsAfterLow.length).toBeGreaterThan(0);
    const afterLow = callsAfterLow[callsAfterLow.length - 1];

    // Then simulate very high FPS to trigger increases.
    for (let i = 0; i < 80; i++) {
      t += 500 / 80;
      runFrames(1);
    }

    const callsAfterHigh = setDprSpy.mock.calls.map((c) => c[0] as number);
    expect(callsAfterHigh.length).toBeGreaterThan(0);
    const afterHigh = callsAfterHigh[callsAfterHigh.length - 1];

    expect(afterHigh).toBeGreaterThan(afterLow);
    expect(afterHigh).toBeLessThanOrEqual(0.9);
  });
});
