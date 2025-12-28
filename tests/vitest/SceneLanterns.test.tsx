import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const lanternPositions: Array<readonly [number, number, number]> = [];

vi.mock('@/components/SkyLantern', () => ({
  SkyLantern: ({ position }: { position: readonly [number, number, number] }) => {
    lanternPositions.push(position);
    return <div data-testid="lantern" />;
  },
}));

import SceneLanterns from '@/SceneLanterns';

describe('SceneLanterns', () => {
  it('renders without crashing - happy path', () => {
    const { container } = render(<SceneLanterns />);
    expect(container.querySelector('group')).toBeTruthy();
  });

  it('renders 3 lanterns at the expected positions', () => {
    lanternPositions.length = 0;

    render(<SceneLanterns />);

    const unique = Array.from(new Set(lanternPositions.map((p) => p.join(',')))).sort();
    expect(unique).toEqual(['-5,5,-5', '0,12,8', '5,8,2']);
  });
});
