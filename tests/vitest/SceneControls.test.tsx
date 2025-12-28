import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

let lastOrbitControlsProps: Record<string, unknown> | undefined;
vi.mock('@react-three/drei', () => ({
  OrbitControls: (props: Record<string, unknown>) => {
    lastOrbitControlsProps = props;
    return <div data-testid="orbit-controls" />;
  },
}));

import SceneControls from '@/SceneControls';

describe('SceneControls', () => {
  it('renders without crashing - happy path', () => {
    const { getByTestId } = render(<SceneControls />);
    expect(getByTestId('orbit-controls')).toBeTruthy();
  });

  it('passes expected OrbitControls props', () => {
    render(<SceneControls />);

    expect(lastOrbitControlsProps).toBeDefined();
    expect(lastOrbitControlsProps?.minDistance).toBe(10);
    expect(lastOrbitControlsProps?.maxDistance).toBe(60);
    expect(lastOrbitControlsProps?.autoRotate).toBe(true);
    expect(lastOrbitControlsProps?.autoRotateSpeed).toBe(0.3);

    const maxPolarAngle = lastOrbitControlsProps?.maxPolarAngle as number;
    expect(maxPolarAngle).toBeCloseTo(Math.PI / 2 - 0.1, 6);
  });
});
