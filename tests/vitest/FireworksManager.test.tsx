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

type WriteExplosionParticles = (
  buffers: {
    position: Float32Array;
    velocity: Float32Array;
    color: Float32Array;
    scale: Float32Array;
    life: Float32Array;
    decay: Float32Array;
  },
  startIndex: number,
  maxParticles: number,
  pos: Vector3,
  color: string
) => number;

const { stepRocketPositionMock, writeExplosionParticlesMock } = vi.hoisted(() => ({
  stepRocketPositionMock: vi.fn<StepRocketPosition>(),
  writeExplosionParticlesMock: vi.fn<WriteExplosionParticles>(),
}));

vi.mock('@/utils/rocket', () => ({
  stepRocketPosition: stepRocketPositionMock,
}));

vi.mock('@/utils/fireworks', () => ({
  writeExplosionParticles: writeExplosionParticlesMock,
}));

import { FireworksManager } from '@/components/FireworksManager';

describe('FireworksManager', () => {
  beforeEach(() => {
    stepRocketPositionMock.mockReset();
    writeExplosionParticlesMock.mockReset();
  });

  it('initializes an instanced particle mesh with max count', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <FireworksManager rockets={[]} removeRocket={() => {}} />
    );

    const mesh = findInstancedMesh(renderer);
    expect(mesh.count).toBe(4000);

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

    // Frame 1: rocket explodes (rocket useFrame), explosion particles are created
    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    expect(removeRocket).toHaveBeenCalledWith('rocket-1');
    // We don't check writeExplosionParticlesMock because the logic is now inline and GPU based.

    await renderer.unmount();
  });
});

type SceneNode = { instance: unknown };
type RendererWithSceneFind = {
  scene: {
    find: (predicate: (node: SceneNode) => boolean) => SceneNode;
  };
};

const isInstancedMesh = (value: unknown): value is InstancedMesh =>
  typeof value === 'object' && value !== null && (value as InstancedMesh).isInstancedMesh === true;

const findInstancedMesh = (renderer: RendererWithSceneFind): InstancedMesh => {
  const node = renderer.scene.find((n) => isInstancedMesh(n.instance));
  const inst = node.instance;
  if (!isInstancedMesh(inst)) throw new Error('Expected an InstancedMesh in the scene');
  return inst;
};
