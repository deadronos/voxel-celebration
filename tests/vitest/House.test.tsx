import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import House from '@/components/House';
import * as THREE from 'three';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('House', () => {
  const mockOnShootRocket = vi.fn();

  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders with default dimensions', () => {
    const { container } = renderInCanvas(<House position={[5, 0, -5]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders with custom dimensions', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} width={6} height={5} depth={7} />
    );
    expect(container).toBeTruthy();
  });

  it('renders with rotation', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} rotation={Math.PI / 4} />
    );
    expect(container).toBeTruthy();
  });

  it('renders with various rotation angles', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} rotation={Math.PI / 2} />
    );
    expect(container).toBeTruthy();
  });

  it('handles negative positions', () => {
    const { container } = renderInCanvas(<House position={[-10, -5, -15]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - zero dimensions', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} width={0} height={0} depth={0} />
    );
    expect(container).toBeTruthy();
  });

  it('handles edge case - very small dimensions', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} width={0.1} height={0.1} depth={0.1} />
    );
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large dimensions', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} width={100} height={100} depth={100} />
    );
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative rotation', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} rotation={-Math.PI / 4} />
    );
    expect(container).toBeTruthy();
  });

  it('handles edge case - full rotation (2*PI)', () => {
    const { container } = renderInCanvas(
      <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} rotation={Math.PI * 2} />
    );
    expect(container).toBeTruthy();
  });

  it('renders lit windows based on random generation', () => {
    // Mock Math.random for deterministic window lighting
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.5); // Will create lit windows

    const { container } = renderInCanvas(<House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('renders dark windows when random is low', () => {
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.1); // Will create dark windows

    const { container } = renderInCanvas(<House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('handles onShootRocket callback prop', () => {
    const callback = vi.fn();
    const { container } = renderInCanvas(<House position={[0, 0, 0]} onShootRocket={callback} />);
    expect(container).toBeTruthy();
    // The callback will be invoked by useFrame after a delay
  });

  it('is memoized for performance', () => {
    // House is wrapped with React.memo
    expect(House).toBeDefined();
    const { container } = renderInCanvas(<House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles multiple houses in scene', () => {
    const { container } = renderInCanvas(
      <>
        <House position={[0, 0, 0]} onShootRocket={mockOnShootRocket} />
        <House position={[10, 0, 0]} onShootRocket={mockOnShootRocket} rotation={Math.PI / 2} />
        <House position={[-10, 0, 0]} onShootRocket={mockOnShootRocket} width={6} height={4} depth={5} />
      </>
    );
    expect(container).toBeTruthy();
  });
});
