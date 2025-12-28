import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { Tree, StreetLight, Ground } from '@/components/Environment';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('Tree', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<Tree position={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });

  it('renders at different positions', () => {
    const { container } = renderInCanvas(<Tree position={[5, 0, -5]} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative positions', () => {
    const { container } = renderInCanvas(<Tree position={[-10, -5, -15]} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large positions', () => {
    const { container } = renderInCanvas(<Tree position={[1000, 2000, 3000]} />);
    expect(container).toBeTruthy();
  });

  it('renders with memoization (displayName is set)', () => {
    expect(Tree.displayName).toBe('Tree');
  });
});

describe('StreetLight', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<StreetLight position={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });

  it('renders at different positions', () => {
    const { container } = renderInCanvas(<StreetLight position={[10, 0, -10]} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative positions', () => {
    const { container } = renderInCanvas(<StreetLight position={[-5, -10, -15]} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large positions', () => {
    const { container } = renderInCanvas(<StreetLight position={[5000, 0, 5000]} />);
    expect(container).toBeTruthy();
  });

  it('renders with memoization (displayName is set)', () => {
    expect(StreetLight.displayName).toBe('StreetLight');
  });
});

describe('Ground', () => {
  it('renders without crashing - happy path', () => {
    // Mock Math.random for deterministic testing
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.5);

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('generates ground voxels with random distribution', () => {
    // Mock random to test different distributions
    const originalRandom = Math.random;
    let callCount = 0;
    Math.random = vi.fn(() => {
      callCount++;
      // Alternate between different values
      return callCount % 2 === 0 ? 0.9 : 0.7;
    });

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('handles edge case - all snow (random > 0.8)', () => {
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.85);

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('handles edge case - no snow (random <= 0.8)', () => {
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.5);

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('handles edge case - all elevated (random > 0.85)', () => {
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.9);

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('handles edge case - no elevation (random <= 0.85)', () => {
    const originalRandom = Math.random;
    Math.random = vi.fn(() => 0.5);

    const { container } = renderInCanvas(<Ground />);
    expect(container).toBeTruthy();

    Math.random = originalRandom;
  });

  it('renders with memoization (displayName is set)', () => {
    expect(Ground.displayName).toBe('Ground');
  });
});
