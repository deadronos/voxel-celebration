import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { BufferGeometry, Points, ShaderMaterial } from 'three';
import { Snowfall } from '@/components/Snowfall';

describe('Snowfall', () => {
  it('creates a Points with geometry attributes (happy path)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const renderer = await ReactThreeTestRenderer.create(<Snowfall />);

    const pointsNode = renderer.scene.findByType('Points');
    const points = pointsNode.instance as unknown as Points;
    const geometry = points.geometry as unknown as BufferGeometry;

    expect(geometry.getAttribute('position')).toBeTruthy();
    expect(geometry.getAttribute('speed')).toBeTruthy();

    await renderer.unmount();
  });

  it('updates the shader time uniform on frame advances', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);

    const renderer = await ReactThreeTestRenderer.create(<Snowfall />);
    const pointsNode = renderer.scene.findByType('Points');
    const points = pointsNode.instance as unknown as Points;
    const material = points.material as unknown as ShaderMaterial & {
      uniforms: { time: { value: number } };
    };

    material.uniforms.time.value = 123;

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(2, 0.5);
    });

    expect(material.uniforms.time.value).not.toBe(123);
    await renderer.unmount();
  });
});
