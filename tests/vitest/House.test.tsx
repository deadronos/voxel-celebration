import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import * as THREE from 'three';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@/components/InstancedVoxels', () => ({
  InstancedVoxels: () => null,
}));

vi.mock('@/utils/threeCache', () => ({
  getVoxelMaterial: () => ({ kind: 'mockMaterial' }),
}));

import House from '@/components/House';

describe('House', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires a rocket when the timer elapses (launch position accounts for rotation)', () => {
    const onShootRocket = vi.fn();

    // Random call order in House:
    // 1-3) 3 window light booleans
    // 4) start delay => ((0 * 10) + 5) * 1000 = 5000ms
    // 5) randomColor index
    // 6) next delay
    const randomSpy = vi.spyOn(Math, 'random');

    // Windows lit status (3 calls)
    randomSpy.mockReturnValueOnce(0.4);
    randomSpy.mockReturnValueOnce(0.4);
    randomSpy.mockReturnValueOnce(0.4);

    // Initial delay calculation: (random * 10 + 5) * 1000
    // Let's ensure delay is 5000ms
    randomSpy.mockReturnValueOnce(0.0);

    // Color selection inside the callback
    randomSpy.mockReturnValueOnce(0);

    // Next delay calculation inside the callback
    randomSpy.mockReturnValueOnce(0.0);

    const { container } = render(
      <House position={[10, 0, 0]} rotation={Math.PI / 2} onShootRocket={onShootRocket} />
    );

    // Initially not called
    expect(onShootRocket).not.toHaveBeenCalled();

    // Advance time by 4.9s - still nothing
    vi.advanceTimersByTime(4900);
    expect(onShootRocket).not.toHaveBeenCalled();

    // Advance time by another 200ms (total 5.1s) - should fire
    vi.advanceTimersByTime(200);

    expect(onShootRocket).toHaveBeenCalledTimes(1);
    const [launchPos, color] = onShootRocket.mock.calls[0] as [THREE.Vector3, string];

    // For width=4,height=3,depth=4 the chimney offset is (1,5,1)
    // Rotated by +90deg around Y using applyAxisAngle => (1,5,-1)
    expect(launchPos.x).toBeCloseTo(11, 6);
    expect(launchPos.y).toBeCloseTo(5, 6);
    expect(launchPos.z).toBeCloseTo(-1, 6);
    expect(color).toBeTruthy();

    // If any windows are lit, there is a glow pointLight
    expect(container.querySelector('pointlight')).toBeTruthy();
  });

  it('does not render glow light when all windows are dark', () => {
    const onShootRocket = vi.fn();
    const randomSpy = vi.spyOn(Math, 'random');

    // Windows lit status (3 calls) - all dark (<0.3)
    randomSpy.mockReturnValueOnce(0.0);
    randomSpy.mockReturnValueOnce(0.0);
    randomSpy.mockReturnValueOnce(0.0);

    // Initial delay
    randomSpy.mockReturnValueOnce(0.0);

    const { container } = render(<House position={[0, 0, 0]} onShootRocket={onShootRocket} />);
    expect(container.querySelector('pointlight')).toBeFalsy();
  });
});
