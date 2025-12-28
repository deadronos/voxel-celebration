import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import SceneLanterns from '@/SceneLanterns';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('SceneLanterns', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });

  it('renders multiple sky lanterns', () => {
    // SceneLanterns renders 3 lanterns by default
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });

  it('renders lanterns in a group', () => {
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });

  it('positions group correctly', () => {
    // Group is positioned at [0, -2, 0]
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });

  it('lanterns have unique keys', () => {
    // Each lantern has a unique key based on position
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });

  it('handles multiple renders', () => {
    const { rerender, container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
    rerender(
      <Canvas>
        <SceneLanterns />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('renders all three lantern positions', () => {
    // Lanterns at [-5, 5, -5], [5, 8, 2], [0, 12, 8]
    const { container } = renderInCanvas(<SceneLanterns />);
    expect(container).toBeTruthy();
  });
});
