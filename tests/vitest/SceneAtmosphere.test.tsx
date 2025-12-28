import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

let lastStarsProps: Record<string, unknown> | undefined;
let lastCloudProps: Record<string, unknown> | undefined;

vi.mock('@/components/AuroraSky', () => ({
  AuroraSky: () => <div data-testid="aurora" />,
}));

vi.mock('@react-three/drei', () => ({
  Stars: (props: Record<string, unknown>) => {
    lastStarsProps = props;
    return <div data-testid="stars" />;
  },
  Cloud: (props: Record<string, unknown>) => {
    lastCloudProps = props;
    return <div data-testid="cloud" />;
  },
}));

import SceneAtmosphere from '@/SceneAtmosphere';

describe('SceneAtmosphere', () => {
  it('renders AuroraSky, Stars, and Cloud with expected props', () => {
    const { getByTestId } = render(<SceneAtmosphere />);

    expect(getByTestId('aurora')).toBeTruthy();
    expect(getByTestId('stars')).toBeTruthy();
    expect(getByTestId('cloud')).toBeTruthy();

    expect(lastStarsProps).toEqual(
      expect.objectContaining({ radius: 100, depth: 60, count: 8000, factor: 6, saturation: 0.9, fade: true, speed: 2 })
    );
    expect(lastCloudProps).toEqual(
      expect.objectContaining({ opacity: 0.4, speed: 0.2, bounds: [40, 6, 4], segments: 30, position: [0, 25, -20], color: '#221133' })
    );
  });
});
