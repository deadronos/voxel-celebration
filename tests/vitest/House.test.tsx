import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as THREE from 'three';

const frameCallbacks: Array<(state: unknown, delta: number) => void> = [];
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: (state: unknown, delta: number) => void) => frameCallbacks.push(cb),
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
    frameCallbacks.length = 0;
    vi.restoreAllMocks();
  });

  it('fires a rocket when the timer elapses (launch position accounts for rotation)', () => {
    const onShootRocket = vi.fn();

    // Random call order in House:
    // 1) nextShootTime start delay
    // 2-4) 3 window light booleans
    // 5) randomColor index
    // 6) reset timer
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // start delay => 2s
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0) // choose first fireworks color
      .mockReturnValueOnce(0); // reset timer => 5s

    const { container } = render(
      <House position={[10, 0, 0]} rotation={Math.PI / 2} onShootRocket={onShootRocket} />
    );

    expect(frameCallbacks).toHaveLength(1);
    const cb = frameCallbacks[0];

    cb({} as unknown, 1);
    expect(onShootRocket).not.toHaveBeenCalled();

    cb({} as unknown, 1.1);

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
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.0)
      .mockReturnValueOnce(0.0)
      .mockReturnValueOnce(0.0);

    const { container } = render(<House position={[0, 0, 0]} onShootRocket={onShootRocket} />);
    expect(container.querySelector('pointlight')).toBeFalsy();
  });
});
