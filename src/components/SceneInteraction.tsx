import { type FC } from "react";
import * as THREE from "three";

interface SceneInteractionProps {
  onShoot: (pos: THREE.Vector3, color: string) => void;
}

const FESTIVE_COLORS = ["#ff0044", "#00ff88", "#0088ff", "#ffcc00", "#ff00ff", "#ffffff"];

const SceneInteraction: FC<SceneInteractionProps> = ({ onShoot }) => {
  return (
    <mesh
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={(event) => {
        event.stopPropagation();

        // Pick a random festive color
        const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
        onShoot(event.point.clone(), color);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
};

export default SceneInteraction;
