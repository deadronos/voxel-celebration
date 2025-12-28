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
});
