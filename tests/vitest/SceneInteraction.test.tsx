import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import SceneInteraction from '@/components/SceneInteraction';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// Mock useThree to provide controlled raycaster and camera
vi.mock('@react-three/fiber', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useThree: vi.fn(),
  };
});

describe('SceneInteraction', () => {
  it('calls onShoot when clicked and intersection occurs', async () => {
    const onShoot = vi.fn();

    const mockRaycaster = {
      setFromCamera: vi.fn(),
      ray: {
        intersectPlane: vi.fn().mockImplementation((_plane: THREE.Plane, target: THREE.Vector3) => {
          target.set(10, 0, 10);
          return target;
        }),
      },
    };

    const mockCamera = new THREE.PerspectiveCamera();
    const mockPointer = new THREE.Vector2();

    vi.mocked(useThree).mockImplementation((selector) => {
      const state = {
        camera: mockCamera,
        raycaster: mockRaycaster,
        pointer: mockPointer,
      };
      // @ts-expect-error - Mocking useThree state for testing
      return selector(state);
    });

    const renderer = await ReactThreeTestRenderer.create(<SceneInteraction onShoot={onShoot} />);

    const mesh = renderer.scene.children[0];

    await ReactThreeTestRenderer.act(async () => {
      // fireEvent triggers the onPointerDown prop
      await renderer.fireEvent(mesh, 'pointerDown');
    });

    expect(onShoot).toHaveBeenCalled();
    const [pos, color] = onShoot.mock.calls[0];
    expect(pos).toBeInstanceOf(THREE.Vector3);
    expect(pos.x).toBe(10);
    expect(pos.z).toBe(10);
    expect(typeof color).toBe('string');

    await renderer.unmount();
  });
});
