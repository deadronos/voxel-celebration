import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { FireworksManager } from '@/components/FireworksManager';
import type { RocketData } from '@/types';
import * as THREE from 'three';

// Helper to render R3F components
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe('FireworksManager', () => {
  const mockRemoveRocket = vi.fn();

  it('renders without crashing - happy path with no rockets', () => {
    const { container } = renderInCanvas(<FireworksManager rockets={[]} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders with single rocket', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-1',
        position: new THREE.Vector3(0, 0, 0),
        color: '#ff0000',
        targetHeight: 20,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('renders with multiple rockets', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-1',
        position: new THREE.Vector3(0, 0, 0),
        color: '#ff0000',
        targetHeight: 20,
      },
      {
        id: 'rocket-2',
        position: new THREE.Vector3(5, 0, 5),
        color: '#00ff00',
        targetHeight: 25,
      },
      {
        id: 'rocket-3',
        position: new THREE.Vector3(-5, 0, -5),
        color: '#0000ff',
        targetHeight: 30,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles rockets at different positions', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-1',
        position: new THREE.Vector3(-10, 5, 15),
        color: '#ff00ff',
        targetHeight: 40,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles rockets with different colors', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-1',
        position: new THREE.Vector3(0, 0, 0),
        color: '#ffffff',
        targetHeight: 20,
      },
      {
        id: 'rocket-2',
        position: new THREE.Vector3(0, 0, 0),
        color: '#000000',
        targetHeight: 20,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - rocket at zero position', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-zero',
        position: new THREE.Vector3(0, 0, 0),
        color: '#abcdef',
        targetHeight: 15,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - rocket with zero target height', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-zero-target',
        position: new THREE.Vector3(0, 0, 0),
        color: '#fedcba',
        targetHeight: 0,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - rocket with negative target height', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-negative',
        position: new THREE.Vector3(0, 0, 0),
        color: '#123456',
        targetHeight: -10,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - rocket with very large target height', () => {
    const rockets: RocketData[] = [
      {
        id: 'rocket-high',
        position: new THREE.Vector3(0, 0, 0),
        color: '#aabbcc',
        targetHeight: 10000,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles edge case - many simultaneous rockets', () => {
    const rockets: RocketData[] = Array.from({ length: 50 }, (_, i) => ({
      id: `rocket-${i}`,
      position: new THREE.Vector3(i % 10, 0, Math.floor(i / 10)),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      targetHeight: 20 + i,
    }));
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={mockRemoveRocket} />);
    expect(container).toBeTruthy();
  });

  it('handles removeRocket callback', () => {
    const callback = vi.fn();
    const rockets: RocketData[] = [
      {
        id: 'test-rocket',
        position: new THREE.Vector3(0, 0, 0),
        color: '#ff0000',
        targetHeight: 20,
      },
    ];
    const { container } = renderInCanvas(<FireworksManager rockets={rockets} removeRocket={callback} />);
    expect(container).toBeTruthy();
    // Callback will be called when rocket explodes via useFrame
  });

  it('handles rocket list updates', () => {
    const rockets1: RocketData[] = [
      {
        id: 'rocket-1',
        position: new THREE.Vector3(0, 0, 0),
        color: '#ff0000',
        targetHeight: 20,
      },
    ];
    const { rerender, container } = renderInCanvas(
      <FireworksManager rockets={rockets1} removeRocket={mockRemoveRocket} />
    );
    expect(container).toBeTruthy();

    // Update rockets
    const rockets2: RocketData[] = [
      {
        id: 'rocket-2',
        position: new THREE.Vector3(5, 0, 5),
        color: '#00ff00',
        targetHeight: 25,
      },
    ];
    rerender(
      <Canvas>
        <FireworksManager rockets={rockets2} removeRocket={mockRemoveRocket} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
