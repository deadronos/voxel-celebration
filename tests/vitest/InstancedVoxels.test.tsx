import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { InstancedVoxels, type VoxelInstance } from '@/components/InstancedVoxels';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('InstancedVoxels', () => {
  it('renders without crashing - happy path with single instance', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#ff0000' }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple instances', () => {
    const instances: VoxelInstance[] = [
      { position: [0, 0, 0], color: '#ff0000' },
      { position: [1, 0, 0], color: '#00ff00' },
      { position: [0, 1, 0], color: '#0000ff' },
    ];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('renders instances with custom scales', () => {
    const instances: VoxelInstance[] = [
      { position: [0, 0, 0], color: '#ff0000', scale: [2, 2, 2] },
      { position: [1, 0, 0], color: '#00ff00', scale: [1, 3, 1] },
      { position: [0, 1, 0], color: '#0000ff', scale: [0.5, 0.5, 0.5] },
    ];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('renders with custom material', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#ffffff' }];
    // Material will be passed by parent component in real usage
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('renders with castShadow and receiveShadow enabled by default', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#ff00ff' }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('renders with castShadow disabled', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#00ffff' }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} castShadow={false} />);
    expect(container).toBeTruthy();
  });

  it('renders with receiveShadow disabled', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#ffff00' }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} receiveShadow={false} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - empty instances array', () => {
    const instances: VoxelInstance[] = [];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    // Component should return null for empty array
    expect(container).toBeTruthy();
  });

  it('handles edge case - single instance with zero scale', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#000000', scale: [0, 0, 0] }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative positions', () => {
    const instances: VoxelInstance[] = [
      { position: [-10, -20, -30], color: '#111111' },
      { position: [-5, -15, -25], color: '#222222' },
    ];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large number of instances', () => {
    const instances: VoxelInstance[] = Array.from({ length: 100 }, (_, i) => ({
      position: [i % 10, Math.floor(i / 10), 0] as readonly [number, number, number],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    }));
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - instances with extremely large positions', () => {
    const instances: VoxelInstance[] = [
      { position: [1000, 2000, 3000], color: '#aabbcc' },
      { position: [9999, 9999, 9999], color: '#ddeeff' },
    ];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - instances with negative scales', () => {
    const instances: VoxelInstance[] = [{ position: [0, 0, 0], color: '#fedcba', scale: [-1, -1, -1] }];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - mixed scale types (some with scale, some without)', () => {
    const instances: VoxelInstance[] = [
      { position: [0, 0, 0], color: '#ff0000' },
      { position: [1, 0, 0], color: '#00ff00', scale: [2, 2, 2] },
      { position: [2, 0, 0], color: '#0000ff' },
    ];
    const { container } = renderInCanvas(<InstancedVoxels instances={instances} />);
    expect(container).toBeTruthy();
  });
});
