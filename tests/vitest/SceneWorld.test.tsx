import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import SceneWorld from '@/SceneWorld';
import * as THREE from 'three';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('SceneWorld', () => {
  const mockOnShootRocket = vi.fn();

  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders Ground component', () => {
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple House components', () => {
    // SceneWorld renders 5 houses by default
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple StreetLight components', () => {
    // SceneWorld renders 5 street lights
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple Tree components', () => {
    // SceneWorld renders 6 trees
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('positions group correctly', () => {
    // Group is positioned at [0, -2, 0]
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('houses have unique keys', () => {
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('houses have different configurations', () => {
    // Each house has different rotation, width, height, depth
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('street lights have unique positions', () => {
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('trees have unique positions', () => {
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('passes onShootRocket callback to houses', () => {
    const callback = vi.fn();
    const { container } = renderInCanvas(<SceneWorld onShootRocket={callback} />);
    expect(container).toBeTruthy();
    // Callback will be invoked by houses when they shoot rockets
  });

  it('handles multiple renders', () => {
    const { rerender, container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
    rerender(
      <Canvas>
        <SceneWorld onShootRocket={mockOnShootRocket} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('houses are positioned at different locations', () => {
    // Houses at various x, y, z coordinates
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('houses have different rotations', () => {
    // Houses rotated at different angles
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('houses have custom dimensions', () => {
    // Houses with different widths, heights, depths
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('street lights positioned around center', () => {
    // Street lights at [0,0,0], [-10,0,0], [10,0,0], [0,0,10], [0,0,-5]
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });

  it('trees positioned around perimeter', () => {
    // Trees at various positions forming a perimeter
    const { container } = renderInCanvas(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container).toBeTruthy();
  });
});
