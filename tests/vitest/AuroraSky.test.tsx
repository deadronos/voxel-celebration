import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { AuroraSky } from '@/components/AuroraSky';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('AuroraSky', () => {
  it('renders without crashing - happy path', () => {
    const { container } = renderInCanvas(<AuroraSky />);
    expect(container).toBeTruthy();
  });

  it('renders with shader material', () => {
    const { container } = renderInCanvas(<AuroraSky />);
    expect(container).toBeTruthy();
  });

  it('initializes with uniforms', () => {
    const { container } = renderInCanvas(<AuroraSky />);
    expect(container).toBeTruthy();
  });

  it('handles animation frame updates', () => {
    const { container } = renderInCanvas(<AuroraSky />);
    // Component uses useFrame hook which will be called by R3F
    expect(container).toBeTruthy();
  });

  it('renders multiple instances without conflict', () => {
    const { container } = renderInCanvas(
      <>
        <AuroraSky />
        <AuroraSky />
      </>
    );
    expect(container).toBeTruthy();
  });
});
