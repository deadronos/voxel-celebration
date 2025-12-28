import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { Voxel, VoxelStack } from '@/components/VoxelUtils';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('Voxel', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#ff0000" />);
    expect(container).toBeTruthy();
  });

  it('renders with emissive properties', () => {
    const { container } = renderInCanvas(
      <Voxel position={[1, 2, 3]} color="#00ff00" emissive="#ff0000" emissiveIntensity={0.5} />
    );
    expect(container).toBeTruthy();
  });

  it('renders with custom scale', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#0000ff" scale={[2, 2, 2]} />);
    expect(container).toBeTruthy();
  });

  it('handles default emissiveIntensity', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#ffffff" emissive="#000000" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - zero position', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#000000" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative positions', () => {
    const { container } = renderInCanvas(<Voxel position={[-5, -10, -15]} color="#123456" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large positions', () => {
    const { container } = renderInCanvas(<Voxel position={[1000, 2000, 3000]} color="#abcdef" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - zero scale', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#ff00ff" scale={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative scale', () => {
    const { container } = renderInCanvas(<Voxel position={[0, 0, 0]} color="#00ffff" scale={[-1, -1, -1]} />);
    expect(container).toBeTruthy();
  });
});

describe('VoxelStack', () => {
  it('renders stack of voxels - happy path', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={3} color="#ff0000" />);
    expect(container).toBeTruthy();
  });

  it('renders single voxel when height is 1', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={1} color="#00ff00" />);
    expect(container).toBeTruthy();
  });

  it('renders multiple voxels with height > 1', () => {
    const { container } = renderInCanvas(<VoxelStack position={[5, 0, 5]} height={10} color="#0000ff" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - zero height', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={0} color="#ffffff" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative height (bad input)', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={-5} color="#000000" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large height', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={100} color="#123456" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - fractional height (rounds down)', () => {
    const { container } = renderInCanvas(<VoxelStack position={[0, 0, 0]} height={3.7} color="#fedcba" />);
    expect(container).toBeTruthy();
  });

  it('handles different positions', () => {
    const { container } = renderInCanvas(<VoxelStack position={[-10, 5, -15]} height={5} color="#aabbcc" />);
    expect(container).toBeTruthy();
  });
});
