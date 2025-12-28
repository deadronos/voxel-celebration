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

  it('initializes an instanced particle mesh with zero count', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <FireworksManager rockets={[]} removeRocket={() => {}} />
    );

    const mesh = findInstancedMesh(renderer);
    expect(mesh.count).toBe(0);

    await renderer.unmount();
  });

  it('explodes a rocket, removes it, and renders surviving particles', async () => {
    const removeRocket = vi.fn();

    let stepCalls = 0;
    stepRocketPositionMock.mockImplementation((_y, _speed, _delta, _target) => {
      stepCalls++;
      return { newY: 10, exploded: stepCalls === 1 };
    });

    writeExplosionParticlesMock.mockImplementation((buffers, startIndex, _maxParticles, pos, _c) => {
      const base = startIndex;
      let o3 = base * 3;
      buffers.position[o3] = pos.x;
      buffers.position[o3 + 1] = 1;
      buffers.position[o3 + 2] = pos.z;
      buffers.velocity[o3] = 0;
      buffers.velocity[o3 + 1] = 0;
      buffers.velocity[o3 + 2] = 0;
      buffers.color[o3] = 1;
      buffers.color[o3 + 1] = 0;
      buffers.color[o3 + 2] = 0;
      buffers.scale[base] = 1;
      buffers.life[base] = 1;
      buffers.decay[base] = 0.1;

      const base2 = base + 1;
      o3 = base2 * 3;
      buffers.position[o3] = pos.x;
      buffers.position[o3 + 1] = -1;
      buffers.position[o3 + 2] = pos.z;
      buffers.velocity[o3] = 0;
      buffers.velocity[o3 + 1] = 0;
      buffers.velocity[o3 + 2] = 0;
      buffers.color[o3] = 1;
      buffers.color[o3 + 1] = 0;
      buffers.color[o3 + 2] = 0;
      buffers.scale[base2] = 1;
      buffers.life[base2] = 0;
      buffers.decay[base2] = 0.1;

      return 2;
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
    expect(writeExplosionParticlesMock).toHaveBeenCalled();

    // Frame 2: particle manager processes particles and updates instanced mesh
    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    const mesh = findInstancedMesh(renderer);
    expect(mesh.count).toBe(1);

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
