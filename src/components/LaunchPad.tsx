import { type FC, useState } from "react";
import * as THREE from "three";
import { VoxelModel } from "./VoxelModel";
import { COLORS } from "../constants";
import { type VoxelInstance } from "./InstancedVoxels";

interface LaunchPadProps {
  position: readonly [number, number, number];
  onShootMega: (pos: THREE.Vector3, color: string) => void;
}

const MEGA_COLORS = ["#ff3300", "#ff00ff", "#ffff00", "#00ffff", "#ffffff"];

export const LaunchPad: FC<LaunchPadProps> = ({ position, onShootMega }) => {
  const [hovered, setHovered] = useState(false);
  const [x, y, z] = position;

  const voxels: VoxelInstance[] = [
    // Base platform
    { position: [0, 0, 0] as const, scale: [3, 0.4, 3] as const, color: "#444444" },
    { position: [0, 0.3, 0] as const, scale: [2.2, 0.2, 2.2] as const, color: "#666666" },
    // Launch tube
    { position: [0, 0.8, 0] as const, scale: [1, 1, 1] as const, color: COLORS.stone },
    // Top glow ring
    { position: [0, 1.35, 0] as const, scale: [1.1, 0.1, 1.1] as const, color: hovered ? "#00ffff" : "#333333" },
  ];

  return (
    <group position={[x, y, z]}>
      <VoxelModel
        instances={voxels}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          const color = MEGA_COLORS[Math.floor(Math.random() * MEGA_COLORS.length)];
          // Launch from the tube position
          onShootMega(new THREE.Vector3(x, y + 1.5, z), color);
        }}
      />

      {/* Platform beacon light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={hovered ? 5 : 2}
        distance={5}
        color={hovered ? "#00ffff" : "#ffaa00"}
      />
    </group>
  );
};
