/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { type InstancedMesh, Vector3 } from 'three';
import { rocketStore } from '@/utils/rocketStore';

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
    rocketStore.getRockets().forEach((r) => rocketStore.removeRocket(r.id));
  });
  beforeEach(() => {
    stepRocketPositionMock.mockReset();
  });

  it('initializes an instanced particle mesh with max count', async () => {
    let renderer: any;
    await ReactThreeTestRenderer.act(async () => {
      renderer = await ReactThreeTestRenderer.create(<FireworksManager />);
    });

    // Find all instanced meshes
    const meshes = renderer.scene.findAll((n: any) => isInstancedMesh(n.instance));
    // One for particles, one for rockets
    expect(meshes.length).toBe(2);

    const particleMesh = meshes.find((m: any) => (m.instance as InstancedMesh).count === 8000);
    expect(particleMesh).toBeDefined();

    await renderer.unmount();
  });

  it('explodes a rocket, removes it', async () => {
    let stepCalls = 0;
    stepRocketPositionMock.mockImplementation((_y, _speed, _delta, _target) => {
      stepCalls++;
      return { newY: 10, exploded: stepCalls === 1 };
    });

    let renderer: any;
    await ReactThreeTestRenderer.act(async () => {
      renderer = await ReactThreeTestRenderer.create(<FireworksManager />);
    });
    // Give a tick for useEffect to run
    await ReactThreeTestRenderer.act(async () => {
      await Promise.resolve();
    });

    const spy = vi.spyOn(rocketStore, 'removeRocket');
    await ReactThreeTestRenderer.act(async () => {
      rocketStore.addRocket(new Vector3(0, 0, 0), '#ff0000');
    });

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    expect(spy).toHaveBeenCalled();

    await renderer.unmount();
  });

  it('keeps all active rockets within the instanced rocket pool', async () => {
    stepRocketPositionMock.mockReturnValue({ newY: 1, exploded: false });

    let renderer: any;
    await ReactThreeTestRenderer.act(async () => {
      renderer = await ReactThreeTestRenderer.create(<FireworksManager />);
    });
    // Give a tick for useEffect to run
    await ReactThreeTestRenderer.act(async () => {
      await Promise.resolve();
    });

    await ReactThreeTestRenderer.act(async () => {
      for (let i = 0; i < 51; i++) {
        rocketStore.addRocket(new Vector3(i, 0, 0), '#00ff88');
      }
    });

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 0.016);
    });

    const rocketMesh = renderer.scene
      .findAll((n: any) => isInstancedMesh(n.instance))
      .map((node: any) => node.instance as InstancedMesh)
      .find((mesh: any) => mesh.count !== 8000);

    expect(rocketMesh?.count).toBe(51);

    await renderer.unmount();
  });
});

const isInstancedMesh = (value: unknown): value is InstancedMesh =>
  typeof value === 'object' && value !== null && (value as InstancedMesh).isInstancedMesh === true;
