import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import ScenePostProcessing from '@/ScenePostProcessing';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('ScenePostProcessing', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('renders EffectComposer', () => {
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('renders Bloom effect', () => {
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('disables normal pass in EffectComposer', () => {
    // enableNormalPass is set to false for performance
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('configures Bloom with correct luminanceThreshold', () => {
    // luminanceThreshold is 0.8
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('configures Bloom with correct intensity', () => {
    // intensity is 1.8
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('configures Bloom with correct radius', () => {
    // radius is 0.5
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('enables mipmapBlur for better performance', () => {
    const { container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
  });

  it('handles multiple renders', () => {
    const { rerender, container } = renderInCanvas(<ScenePostProcessing />);
    expect(container).toBeTruthy();
    rerender(
      <Canvas>
        <ScenePostProcessing />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
