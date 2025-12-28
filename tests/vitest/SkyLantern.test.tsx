import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { SkyLantern } from '@/components/SkyLantern';
import type { Group, PointLight } from 'three';

describe('SkyLantern', () => {
  it('has proper displayName for debugging', () => {
    expect(SkyLantern.displayName).toBe('SkyLantern');
  });

  it('moves upward and updates light intensity on frames', async () => {
    // Make randomOffset/speed deterministic and remove per-frame noise
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // randomOffset
      .mockReturnValueOnce(0) // speed (0.5)
      .mockReturnValue(0.5); // per-frame flicker noise

    const renderer = await ReactThreeTestRenderer.create(<SkyLantern position={[0, 0, 0]} />);
    const groupNode = renderer.scene.findByType('Group');
    const lightNode = renderer.scene.findByType('PointLight');
    const group = groupNode.instance as unknown as Group;
    const light = lightNode.instance as unknown as PointLight;

    const y0 = group.position.y;

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(2, 1);
    });

    // SkyLantern applies upward speed twice per frame
    expect(group.position.y).toBeGreaterThan(y0);
    expect(light.intensity).toBeGreaterThan(0);

    await renderer.unmount();
  });

  it('wraps back to bottom after exceeding max height', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // randomOffset
      .mockReturnValueOnce(0) // speed
      .mockReturnValue(0.5);

    const renderer = await ReactThreeTestRenderer.create(<SkyLantern position={[0, 41, 0]} />);
    const groupNode = renderer.scene.findByType('Group');
    const group = groupNode.instance as unknown as Group;

    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 1);
    });

    // After reset, y should be near -5 (plus one additional speed increment)
    expect(group.position.y).toBeLessThan(0);
    await renderer.unmount();
  });
});
