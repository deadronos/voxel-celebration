import React from 'react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

let currentDpr = 1;
const observedResolutions: number[] = [];

vi.mock('@react-three/fiber', () => ({
  useThree: (selector: (state: { viewport: { dpr: number } }) => unknown) =>
    selector({ viewport: { dpr: currentDpr } }),
}));

vi.mock('@react-three/drei', () => ({
  MeshReflectorMaterial: (props: { resolution?: number }) => {
    if (typeof props.resolution === 'number') observedResolutions.push(props.resolution);
    return <div data-testid="mesh-reflector" data-resolution={props.resolution} />;
  },
}));

import { IceLake } from '@/components/IceLake';

describe('IceLake', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('clamps reflector resolution at the minimum when DPR is low', () => {
    observedResolutions.length = 0;
    currentDpr = 0.5;

    const { getByTestId } = render(<IceLake />);

    expect(getByTestId('mesh-reflector')).toHaveAttribute('data-resolution', '256');
    expect(observedResolutions.at(-1)).toBe(256);
  });

  it('scales reflector resolution with DPR (happy path)', () => {
    observedResolutions.length = 0;
    currentDpr = 1.7;

    const { getByTestId } = render(<IceLake />);

    // 256 * 1.7 = 435.2 -> Math.round => 435
    expect(getByTestId('mesh-reflector')).toHaveAttribute('data-resolution', '435');
    expect(observedResolutions.at(-1)).toBe(435);
  });

  it('clamps reflector resolution at the maximum when DPR is high', () => {
    observedResolutions.length = 0;
    currentDpr = 4;

    const { getByTestId } = render(<IceLake />);

    expect(getByTestId('mesh-reflector')).toHaveAttribute('data-resolution', '512');
    expect(observedResolutions.at(-1)).toBe(512);
  });

  it('memoizes the computed resolution for the same DPR', () => {
    observedResolutions.length = 0;
    currentDpr = 1;

    const { rerender } = render(<IceLake />);
    rerender(<IceLake />);
    rerender(<IceLake />);

    // The component re-renders, but resolution should remain stable.
    expect(observedResolutions.length).toBeGreaterThan(0);
    expect(new Set(observedResolutions).size).toBe(1);
    expect(observedResolutions[0]).toBe(256);
  });
});
