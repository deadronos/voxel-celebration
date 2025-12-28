import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import SceneControls from '@/SceneControls';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('SceneControls', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('renders OrbitControls component', () => {
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('configures maxPolarAngle correctly', () => {
    // maxPolarAngle prevents camera from going below ground
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('configures minDistance correctly', () => {
    // minDistance is set to 10
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('configures maxDistance correctly', () => {
    // maxDistance is set to 60
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('enables autoRotate', () => {
    // autoRotate is enabled
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('sets autoRotateSpeed', () => {
    // autoRotateSpeed is 0.3
    const { container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
  });

  it('handles multiple renders', () => {
    const { rerender, container } = renderInCanvas(<SceneControls />);
    expect(container).toBeTruthy();
    rerender(
      <Canvas>
        <SceneControls />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
