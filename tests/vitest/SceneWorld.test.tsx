import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const houseProps: Array<Record<string, unknown>> = [];
const streetLightProps: Array<Record<string, unknown>> = [];
const treeProps: Array<Record<string, unknown>> = [];
let groundRendered = 0;

vi.mock('@/components/Environment', () => ({
  Ground: () => {
    groundRendered++;
    return <div data-testid="ground" />;
  },
  StreetLight: (props: Record<string, unknown>) => {
    streetLightProps.push(props);
    return <div data-testid="streetlight" />;
  },
  Tree: (props: Record<string, unknown>) => {
    treeProps.push(props);
    return <div data-testid="tree" />;
  },
}));

vi.mock('@/components/House', () => ({
  default: (props: Record<string, unknown>) => {
    houseProps.push(props);
    return <div data-testid="house" />;
  },
}));

vi.mock('@/components/IceLake', () => ({
  IceLake: () => <div data-testid="icelake" />,
}));

import SceneWorld from '@/SceneWorld';

describe('SceneWorld', () => {
  const mockOnShootRocket = vi.fn();

  it('renders without crashing - happy path', () => {
    const { container } = render(<SceneWorld onShootRocket={mockOnShootRocket} />);
    expect(container.querySelector('group')).toBeTruthy();
  });

  it('renders expected counts and wires onShootRocket into houses', () => {
    houseProps.length = 0;
    streetLightProps.length = 0;
    treeProps.length = 0;
    groundRendered = 0;

    const callback = vi.fn();
    const { container } = render(<SceneWorld onShootRocket={callback} />);

    // Group wrapper exists
    const group = container.querySelector('group');
    expect(group).toBeTruthy();

    expect(groundRendered).toBeGreaterThanOrEqual(1);

    const uniqHousePos = new Set(houseProps.map((p) => (p.position as number[]).join(',')));
    const uniqLightPos = new Set(streetLightProps.map((p) => (p.position as number[]).join(',')));
    const uniqTreePos = new Set(treeProps.map((p) => (p.position as number[]).join(',')));

    expect(uniqHousePos.size).toBe(5);
    expect(uniqLightPos.size).toBe(5);
    expect(uniqTreePos.size).toBe(6);

    expect(houseProps.every((p) => p.onShootRocket === callback)).toBe(true);
  });
});
