import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { getSharedBoxGeometry, getVoxelMaterial, getFireworksParticleMaterial } from '@/utils/threeCache';

describe('threeCache', () => {
  it('returns a shared box geometry', () => {
    const geom = getSharedBoxGeometry();
    expect(geom).toBeInstanceOf(THREE.BoxGeometry);
    expect(geom).toBe(getSharedBoxGeometry()); // same instance
  });

  it('caches voxel materials by options', () => {
    const m1 = getVoxelMaterial({ color: '#ff00ff', emissive: '#000', emissiveIntensity: 1 });
    const m2 = getVoxelMaterial({ color: '#ff00ff', emissive: '#000', emissiveIntensity: 1 });
    expect(m1).toBe(m2);

    const m3 = getVoxelMaterial({ color: '#00ff00' });
    expect(m3).not.toBe(m1);
  });

  it('returns a cached fireworks particle material', () => {
    const p1 = getFireworksParticleMaterial();
    const p2 = getFireworksParticleMaterial();
    expect(p1).toBeInstanceOf(THREE.MeshBasicMaterial);
    expect(p1).toBe(p2);
  });
});
