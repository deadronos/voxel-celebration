import { describe, expect, it } from 'vitest';
import { stepRocketPosition } from '@/utils/rocket';

describe('stepRocketPosition', () => {
  it('moves rocket up and does not explode before reaching target', () => {
    const { newY, exploded } = stepRocketPosition(0, 15, 0.5, 20);
    expect(newY).toBeCloseTo(7.5);
    expect(exploded).toBe(false);
  });

  it('explodes when exceeding target height', () => {
    const { newY, exploded } = stepRocketPosition(10, 15, 1, 20);
    expect(newY).toBeCloseTo(25);
    expect(exploded).toBe(true);
  });
});
