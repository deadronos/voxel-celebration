import { type FC, type ReactNode } from "react";
import { InstancedVoxels, type VoxelInstance } from "./InstancedVoxels";

import { type ThreeEvent } from "@react-three/fiber";

interface VoxelModelProps {
  position?: readonly [number, number, number];
  instances: readonly VoxelInstance[];
  children?: ReactNode;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

export const VoxelModel: FC<VoxelModelProps> = ({ position = [0, 0, 0], instances, children, onClick, onPointerOver, onPointerOut }) => {
  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <InstancedVoxels instances={instances} />
      {children}
    </group>
  );
};
