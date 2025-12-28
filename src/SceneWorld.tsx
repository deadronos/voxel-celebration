import type { Vector3 } from 'three';

import { Ground, Tree, StreetLight } from './components/Environment';
import { IceLake } from './components/IceLake';
import House from './components/House';

const HOUSES: ReadonlyArray<
  Readonly<{
    key: string;
    position: readonly [number, number, number];
    rotation?: number;
    width?: number;
    height?: number;
    depth?: number;
  }>
> = [
  { key: 'house-1', position: [-8, 0, -8], rotation: Math.PI / 4, width: 5, height: 4, depth: 5 },
  { key: 'house-2', position: [8, 0, -8], rotation: -Math.PI / 4, width: 4, height: 3, depth: 6 },
  { key: 'house-3', position: [-8, 0, 8], rotation: Math.PI * 0.75, width: 3, height: 5, depth: 3 },
  { key: 'house-4', position: [8, 0, 8], rotation: -Math.PI * 0.75, width: 6, height: 3, depth: 4 },
  { key: 'house-5', position: [0, 0, -12], width: 4, height: 3, depth: 4 },
];

const STREET_LIGHTS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 0, 0],
  [-10, 0, 0],
  [10, 0, 0],
  [0, 0, 10],
  [0, 0, -5],
];

const TREES: ReadonlyArray<readonly [number, number, number]> = [
  [-5, 0, 5],
  [5, 0, 5],
  [-5, 0, -5],
  [5, 0, -5],
  [-12, 0, 0],
  [12, 0, 0],
];

type SceneWorldProps = {
  onShootRocket: (startPos: Vector3, color: string) => void;
};

export default function SceneWorld({ onShootRocket }: SceneWorldProps) {
  return (
    <group position={[0, -2, 0]}>
      <Ground />
      <IceLake />

      {HOUSES.map((house) => (
        <House
          key={house.key}
          position={house.position}
          onShootRocket={onShootRocket}
          rotation={house.rotation}
          width={house.width}
          height={house.height}
          depth={house.depth}
        />
      ))}

      {STREET_LIGHTS.map((pos) => (
        <StreetLight key={pos.join(',')} position={pos} />
      ))}

      {TREES.map((pos) => (
        <Tree key={pos.join(',')} position={pos} />
      ))}
    </group>
  );
}
