import { describe, expect, it } from 'vitest';
import { COLORS, HOUSE_CONFIG, VOXEL_SIZE } from '@/constants';

describe('constants', () => {
  it('exposes a fireworks palette', () => {
    expect(Array.isArray(COLORS.fireworks)).toBe(true);
    expect(COLORS.fireworks.length).toBeGreaterThan(0);
    expect(COLORS.fireworks).toContain('#ff0000');
  });

  it('exposes house config and voxel size', () => {
    expect(HOUSE_CONFIG.width).toBeGreaterThan(0);
    expect(HOUSE_CONFIG.height).toBeGreaterThan(0);
    expect(HOUSE_CONFIG.depth).toBeGreaterThan(0);
    expect(VOXEL_SIZE).toBeGreaterThan(0);
  });
});
