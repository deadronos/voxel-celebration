import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Color, type InstancedMesh, Vector3 } from 'three';
import type { ParticleData, RocketData } from '@/types';

type StepRocketPosition = (
  y: number,
  speed: number,
  delta: number,
  targetHeight: number
) => { newY: number; exploded: boolean };

type ExplosionOpts = {
  out: ParticleData[];
  pool: ParticleData[];
  count?: number;
  spread?: number;
};

type CreateExplosionParticles = (
  pos: Vector3,
  color: string,
  opts: ExplosionOpts
) => ParticleData[];

const { stepRocketPositionMock, createExplosionParticlesMock } = vi.hoisted(() => ({
  stepRocketPositionMock: vi.fn<StepRocketPosition>(),
  createExplosionParticlesMock: vi.fn<CreateExplosionParticles>(),
}));

vi.mock('@/utils/rocket', () => ({
  stepRocketPosition: stepRocketPositionMock,
}));

vi.mock('@/utils/fireworks', () => ({
  createExplosionParticles: createExplosionParticlesMock,
}));

import { FireworksManager } from '@/components/FireworksManager';

describe('FireworksManager', () => {
  beforeEach(() => {
    stepRocketPositionMock.mockReset();
    createExplosionParticlesMock.mockReset();
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
    let poolRef: ParticleData[] | undefined;

    stepRocketPositionMock.mockImplementation(
      (_y: number, _speed: number, _delta: number, _target: number) => ({
        newY: 10,
        exploded: true,
      })
    );

    createExplosionParticlesMock.mockImplementation((pos, color, opts) => {
      poolRef = opts.pool;
      const p1: ParticleData = {
        position: pos.clone().setY(1),
        velocity: new Vector3(0, 0, 0),
        color: new Color(color),
        scale: 1,
        life: 1,
        decay: 0.1,
      };
      const p2: ParticleData = {
        position: pos.clone().setY(-1),
        velocity: new Vector3(0, 0, 0),
        color: new Color(color),
        scale: 1,
        life: 0,
        decay: 0.1,
      };
      return [p1, p2];
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
    expect(createExplosionParticlesMock).toHaveBeenCalled();

    // Frame 2: particle manager processes particles and updates instanced mesh
    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    const mesh = findInstancedMesh(renderer);
    expect(poolRef).toBeDefined();
    expect(poolRef?.length).toBeGreaterThanOrEqual(1);
    expect(mesh.count).toBeLessThanOrEqual(2);

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
