import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const instancedCalls: Array<{ instances: unknown; material?: unknown }> = [];
const getVoxelMaterialSpy = vi.fn((args: unknown) => {
  void args;
  return { kind: 'mockMaterial' };
});

vi.mock('@/components/InstancedVoxels', () => ({
  InstancedVoxels: ({ instances, material }: { instances: unknown; material?: unknown }) => {
    instancedCalls.push({ instances, material });
    return <div data-testid="instanced" />;
  },
}));

vi.mock('@/utils/threeCache', () => ({
  getVoxelMaterial: (args: unknown) => getVoxelMaterialSpy(args),
}));

import { Tree, StreetLight, Ground } from '@/components/Environment';

afterEach(() => {
  instancedCalls.length = 0;
  getVoxelMaterialSpy.mockClear();
  vi.restoreAllMocks();
});

describe('Tree', () => {
  it('renders without crashing - happy path', () => {
    render(<Tree position={[0, 0, 0]} />);
    const lengths = instancedCalls.map((c) => (c.instances as unknown[]).length);
    expect(lengths).toContain(8);
  });

  it('renders with memoization (displayName is set)', () => {
    expect(Tree.displayName).toBe('Tree');
  });
});

describe('StreetLight', () => {
  it('renders without crashing - happy path', () => {
    const { container } = render(<StreetLight position={[0, 0, 0]} />);

    // light fixture should render a pointLight element
    expect(container.querySelector('pointlight')).toBeTruthy();

    // Instanced voxels include the pole (4) and the fixture (1)
    const lengths = instancedCalls.map((c) => (c.instances as unknown[]).length);
    expect(lengths).toContain(4);
    expect(lengths).toContain(1);

    // fixture material should be created with emissive properties
    expect(getVoxelMaterialSpy).toHaveBeenCalledWith(
      expect.objectContaining({ emissive: '#fffacd', emissiveIntensity: 0.8 })
    );
  });

  it('renders with memoization (displayName is set)', () => {
    expect(StreetLight.displayName).toBe('StreetLight');
  });
});

describe('Ground', () => {
  it('renders without crashing - happy path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    render(<Ground />);
    const anyNonEmpty = instancedCalls.some((c) => (c.instances as unknown[]).length > 0);
    expect(anyNonEmpty).toBe(true);
  });

  it('renders with memoization (displayName is set)', () => {
    expect(Ground.displayName).toBe('Ground');
  });
});
