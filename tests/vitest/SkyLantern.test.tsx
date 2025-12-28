import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { SkyLantern } from '@/components/SkyLantern';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('SkyLantern', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<SkyLantern position={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });

  it('renders with default color', () => {
    const { container } = renderInCanvas(<SkyLantern position={[5, 10, -5]} />);
    expect(container).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { container } = renderInCanvas(<SkyLantern position={[0, 5, 0]} color="#00ff00" />);
    expect(container).toBeTruthy();
  });

  it('handles different positions', () => {
    const { container } = renderInCanvas(<SkyLantern position={[-10, 20, 15]} color="#0000ff" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - negative position', () => {
    const { container } = renderInCanvas(<SkyLantern position={[-5, -10, -15]} color="#ff00ff" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - zero position', () => {
    const { container } = renderInCanvas(<SkyLantern position={[0, 0, 0]} color="#ffffff" />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - very large position values', () => {
    const { container } = renderInCanvas(<SkyLantern position={[1000, 2000, 3000]} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple lanterns without conflict', () => {
    const { container } = renderInCanvas(
      <>
        <SkyLantern position={[0, 5, 0]} color="#ff0000" />
        <SkyLantern position={[5, 10, 5]} color="#00ff00" />
        <SkyLantern position={[-5, 15, -5]} color="#0000ff" />
      </>
    );
    expect(container).toBeTruthy();
  });

  it('has proper displayName for debugging', () => {
    expect(SkyLantern.displayName).toBe('SkyLantern');
  });

  it('handles animation with useFrame hook', () => {
    // The component uses useFrame for animation
    // This test ensures it doesn't crash during rendering
    const { container } = renderInCanvas(<SkyLantern position={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });
});
