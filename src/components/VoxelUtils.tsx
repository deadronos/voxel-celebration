import React, { useMemo } from 'react';
import { getSharedBoxGeometry, getVoxelMaterial } from '@/utils/threeCache';

interface VoxelProps {
  position: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  scale?: [number, number, number];
}

export const Voxel: React.FC<VoxelProps> = ({
  position,
  color,
  emissive,
  emissiveIntensity = 0,
  scale = [1, 1, 1],
}) => {
  const material = useMemo(
    () => getVoxelMaterial({ color, emissive, emissiveIntensity }),
    [color, emissive, emissiveIntensity]
  );

  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <primitive object={getSharedBoxGeometry()} attach="geometry" dispose={null} />
      <primitive object={material} attach="material" dispose={null} />
    </mesh>
  );
};

export const VoxelStack: React.FC<{
  position: [number, number, number];
  height: number;
  color: string;
}> = ({ position, height, color }) => {
  const [x, y, z] = position;
  const blocks = [];
  for (let i = 0; i < height; i++) {
    blocks.push(<Voxel key={i} position={[x, y + i, z]} color={color} />);
  }
  return <group>{blocks}</group>;
};
