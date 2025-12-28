import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';

const getSharedBoxGeometrySpy = vi.fn(() => ({ kind: 'boxGeometry' }));
const getVoxelMaterialSpy = vi.fn((args: unknown) => {
  void args;
  return { kind: 'voxelMaterial' };
});

vi.mock('@/utils/threeCache', () => ({
  getSharedBoxGeometry: () => getSharedBoxGeometrySpy(),
  getVoxelMaterial: (args: unknown) => getVoxelMaterialSpy(args),
}));

import { Voxel, VoxelStack } from '@/components/VoxelUtils';

afterEach(() => {
  getSharedBoxGeometrySpy.mockClear();
  getVoxelMaterialSpy.mockClear();
});

describe('Voxel', () => {
  it('renders without crashing - happy path', () => {
    const { container } = render(<Voxel position={[0, 0, 0]} color="#ff0000" />);
    expect(container.querySelector('mesh')).toBeTruthy();
    expect(getVoxelMaterialSpy).toHaveBeenCalledWith(
      expect.objectContaining({ color: '#ff0000', emissive: undefined, emissiveIntensity: 0 })
    );
    expect(getSharedBoxGeometrySpy).toHaveBeenCalledTimes(1);
  });

  it('renders with emissive properties', () => {
    const { container } = render(
      <Voxel position={[1, 2, 3]} color="#00ff00" emissive="#ff0000" emissiveIntensity={0.5} />
    );
    expect(container.querySelector('mesh')).toBeTruthy();
    expect(getVoxelMaterialSpy).toHaveBeenCalledWith(
      expect.objectContaining({ color: '#00ff00', emissive: '#ff0000', emissiveIntensity: 0.5 })
    );
  });

  it('renders with custom scale', () => {
    const { container } = render(<Voxel position={[0, 0, 0]} color="#0000ff" scale={[2, 2, 2]} />);
    const mesh = container.querySelector('mesh');
    expect(mesh).toBeTruthy();
    expect(mesh?.getAttribute('scale')).toBeTruthy();
  });

  it('memoizes material until inputs change', () => {
    const { rerender } = render(<Voxel position={[0, 0, 0]} color="#ffffff" emissive="#000000" />);
    expect(getVoxelMaterialSpy).toHaveBeenCalledTimes(1);

    rerender(<Voxel position={[0, 0, 0]} color="#ffffff" emissive="#000000" />);
    expect(getVoxelMaterialSpy).toHaveBeenCalledTimes(1);

    rerender(
      <Voxel position={[0, 0, 0]} color="#ffffff" emissive="#000000" emissiveIntensity={2} />
    );
    expect(getVoxelMaterialSpy).toHaveBeenCalledTimes(2);
  });
});

describe('VoxelStack', () => {
  it('renders stack of voxels - happy path', () => {
    const { container } = render(<VoxelStack position={[0, 0, 0]} height={3} color="#ff0000" />);
    expect(container.querySelectorAll('mesh')).toHaveLength(3);
  });

  it('does not render blocks when height <= 0 (bad input)', () => {
    const { container } = render(<VoxelStack position={[0, 0, 0]} height={0} color="#ffffff" />);
    expect(container.querySelectorAll('mesh')).toHaveLength(0);
  });
});
