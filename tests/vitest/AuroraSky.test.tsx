import React from 'react';
import { describe, expect, it } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { AuroraSky } from '@/components/AuroraSky';
import type { Mesh, ShaderMaterial } from 'three';

describe('AuroraSky', () => {
  it('creates a mesh with a ShaderMaterial and uniforms', async () => {
    const renderer = await ReactThreeTestRenderer.create(<AuroraSky />);

    const mesh = renderer.scene.findByType('Mesh');
    const meshObj = mesh.instance as unknown as Mesh;
    const material = meshObj.material as unknown as ShaderMaterial & {
      uniforms?: Record<string, { value: unknown }>;
    };

    expect(material.uniforms).toBeTruthy();
    expect(material.uniforms?.uTime).toBeTruthy();
    expect(material.uniforms?.uColor1).toBeTruthy();
    expect(material.uniforms?.uColor2).toBeTruthy();
    expect(material.uniforms?.uColor3).toBeTruthy();

    await renderer.unmount();
  });

  it('updates uTime on frame advances', async () => {
    const renderer = await ReactThreeTestRenderer.create(<AuroraSky />);
    const mesh = renderer.scene.findByType('Mesh');
    const meshObj = mesh.instance as unknown as Mesh;
    const material = meshObj.material as unknown as ShaderMaterial & {
      uniforms: { uTime: { value: number } };
    };

    material.uniforms.uTime.value = 123;

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(2, 0.5);
    });

    expect(material.uniforms.uTime.value).not.toBe(123);
    await renderer.unmount();
  });
});
