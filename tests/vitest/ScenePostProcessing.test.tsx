import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

type AnyProps = Record<string, unknown>;
let lastComposerProps: AnyProps | undefined;
let lastBloomProps: AnyProps | undefined;

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children, ...props }: AnyProps & { children?: React.ReactNode }) => {
    lastComposerProps = props;
    return <div data-testid="composer">{children}</div>;
  },
  Bloom: (props: AnyProps) => {
    lastBloomProps = props;
    return <div data-testid="bloom" />;
  },
}));

import ScenePostProcessing from '@/ScenePostProcessing';

describe('ScenePostProcessing', () => {
  it('renders without crashing - happy path', () => {
    const { getByTestId } = render(<ScenePostProcessing />);
    expect(getByTestId('composer')).toBeTruthy();
    expect(getByTestId('bloom')).toBeTruthy();
  });

  it('configures EffectComposer and Bloom as expected', () => {
    render(<ScenePostProcessing />);

    expect(lastComposerProps?.enableNormalPass).toBe(false);
    expect(lastBloomProps?.luminanceThreshold).toBe(0.8);
    expect(lastBloomProps?.intensity).toBe(1.8);
    expect(lastBloomProps?.radius).toBe(0.5);
    expect(lastBloomProps?.mipmapBlur).toBe(true);
  });
});
