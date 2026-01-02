import { type FC, type ReactNode } from 'react';
import { InstancedVoxels, type VoxelInstance } from './InstancedVoxels';

interface VoxelModelProps {
  position?: readonly [number, number, number];
  instances: readonly VoxelInstance[];
  children?: ReactNode;
}

export const VoxelModel: FC<VoxelModelProps> = ({ position = [0, 0, 0], instances, children }) => {
  return (
    <group position={position}>
      <InstancedVoxels instances={instances} />
      {children}
    </group>
  );
};
