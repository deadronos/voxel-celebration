import { SkyLantern } from './components/SkyLantern';

const SKY_LANTERNS: ReadonlyArray<readonly [number, number, number]> = [
  [-5, 5, -5],
  [5, 8, 2],
  [0, 12, 8],
];

export default function SceneLanterns() {
  return (
    <group position={[0, -2, 0]}>
      {SKY_LANTERNS.map((pos) => (
        <SkyLantern key={pos.join(',')} position={pos} />
      ))}
    </group>
  );
}
