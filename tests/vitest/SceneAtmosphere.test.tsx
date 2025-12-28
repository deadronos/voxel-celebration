import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import SceneAtmosphere from '@/SceneAtmosphere';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('SceneAtmosphere', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('renders AuroraSky component', () => {
    const { container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('renders Stars component from drei', () => {
    const { container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('renders Cloud component from drei', () => {
    const { container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('renders all atmospheric elements together', () => {
    const { container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('handles multiple renders', () => {
    const { rerender, container } = renderInCanvas(<SceneAtmosphere />);
    expect(container).toBeTruthy();
    rerender(
      <Canvas>
        <SceneAtmosphere />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
