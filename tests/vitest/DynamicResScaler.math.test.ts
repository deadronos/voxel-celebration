import { describe, expect, it } from 'vitest';
import { computeNextDpr } from '@/components/DynamicResScaler';

const base = {
  minDpr: 0.5,
  maxDpr: 1.0,
  step: 0.1,
  targetFps: 60,
  fpsTolerance: 5,
};

describe('computeNextDpr', () => {
  it('reduces DPR when FPS is low but never below min', () => {
    const next = computeNextDpr({ ...base, fps: 40, currentDpr: 0.55 });
    expect(next).toBeGreaterThanOrEqual(base.minDpr);
    expect(next).toBeLessThan(0.55);
  });

  it('increases DPR when FPS is high but never above max', () => {
    const next = computeNextDpr({ ...base, fps: 120, currentDpr: 0.95 });
    expect(next).toBeLessThanOrEqual(base.maxDpr);
    expect(next).toBeGreaterThan(0.95);
  });

  it('keeps DPR unchanged within tolerance band', () => {
    const next = computeNextDpr({ ...base, fps: 60, currentDpr: 0.8 });
    expect(next).toBe(0.8);
  });
});
