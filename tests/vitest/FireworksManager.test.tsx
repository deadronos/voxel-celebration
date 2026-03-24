import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { type InstancedMesh, Vector3 } from 'three';
import type { RocketData } from '@/types';

type StepRocketPosition = (
  y: number,
  speed: number,
  delta: number,
  targetHeight: number
) => { newY: number; exploded: boolean };

const { stepRocketPositionMock } = vi.hoisted(() => ({
  stepRocketPositionMock: vi.fn<StepRocketPosition>(),
}));

vi.mock('@/utils/rocket', () => ({
  stepRocketPosition: stepRocketPositionMock,
}));

import { FireworksManager } from '@/components/FireworksManager';

describe('FireworksManager', () => {
  beforeEach(() => {
    stepRocketPositionMock.mockReset();
  });

  it('initializes an instanced particle mesh with max count', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <FireworksManager rockets={[]} removeRocket={() => {}} />
    );

    // Find all instanced meshes
    const meshes = renderer.scene.findAll((n) => isInstancedMesh(n.instance));
    // One for particles, one for rockets
    expect(meshes.length).toBe(2);

    const particleMesh = meshes.find((m) => (m.instance as InstancedMesh).count === 4000);
    expect(particleMesh).toBeDefined();

    await renderer.unmount();
  });

  it('explodes a rocket, removes it', async () => {
    const removeRocket = vi.fn();

    let stepCalls = 0;
    stepRocketPositionMock.mockImplementation((_y, _speed, _delta, _target) => {
      stepCalls++;
      return { newY: 10, exploded: stepCalls === 1 };
    });

    const rockets: RocketData[] = [
      {
        id: 'rocket-1',
        position: new Vector3(0, 0, 0),
        color: '#ff0000',
        targetHeight: 1,
      },
    ];

    const renderer = await ReactThreeTestRenderer.create(
      <FireworksManager rockets={rockets} removeRocket={removeRocket} />
    );

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    expect(removeRocket).toHaveBeenCalledWith('rocket-1');

    await renderer.unmount();
  });

  it('keeps all active rockets within the instanced rocket pool', async () => {
    const rockets: RocketData[] = Array.from({ length: 51 }, (_, index) => ({
      id: `rocket-${index}`,
      position: new Vector3(index, 0, 0),
      color: '#00ff88',
      targetHeight: 10,
    }));

    stepRocketPositionMock.mockReturnValue({ newY: 1, exploded: false });

    const renderer = await ReactThreeTestRenderer.create(
      <FireworksManager rockets={rockets} removeRocket={() => {}} />
    );

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    const rocketMesh = renderer.scene
      .findAll((n) => isInstancedMesh(n.instance))
      .map((node) => node.instance as InstancedMesh)
      .find((mesh) => mesh.count !== 4000);

    expect(rocketMesh?.count).toBe(51);

    await renderer.unmount();
  });
});

const isInstancedMesh = (value: unknown): value is InstancedMesh =>
  typeof value === 'object' && value !== null && (value as InstancedMesh).isInstancedMesh === true;
