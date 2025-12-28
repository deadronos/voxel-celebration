import React from 'react';
import { describe, expect, it } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { InstancedVoxels, type VoxelInstance } from '@/components/InstancedVoxels';
import { type InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';

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

describe('InstancedVoxels', () => {
  it('creates an InstancedMesh with expected count and instanceColor', async () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#ff0000' }];
    const renderer = await ReactThreeTestRenderer.create(<InstancedVoxels instances={instances} />);

    const mesh = findInstancedMesh(renderer);
    expect(mesh.count).toBe(1);
    expect(mesh.instanceColor).toBeTruthy();
    expect(mesh.geometry.boundingBox).toBeTruthy();
    expect(mesh.geometry.boundingSphere).toBeTruthy();

    await renderer.unmount();
  });

  it('returns null when instances is empty', async () => {
    const renderer = await ReactThreeTestRenderer.create(<InstancedVoxels instances={[]} />);
    const all = renderer.scene.findAllByType('InstancedMesh');
    expect(all).toHaveLength(0);
    await renderer.unmount();
  });

  it('honors per-instance scale values', async () => {
    const instances: VoxelInstance[] = [
      { position: [0, 0, 0], color: '#ff0000' },
      { position: [1, 0, 0], color: '#00ff00', scale: [2, 3, 4] },
    ];

    const renderer = await ReactThreeTestRenderer.create(<InstancedVoxels instances={instances} />);
    const mesh = findInstancedMesh(renderer);

    // Matrix for instance #1 should include the provided scale
    const m = new Matrix4();
    mesh.getMatrixAt(1, m);
    const scale = new Vector3();
    const pos = new Vector3();
    const quat = new Quaternion();
    m.decompose(pos, quat, scale);

    expect(scale.x).toBeCloseTo(2, 6);
    expect(scale.y).toBeCloseTo(3, 6);
    expect(scale.z).toBeCloseTo(4, 6);

    await renderer.unmount();
  });
});
