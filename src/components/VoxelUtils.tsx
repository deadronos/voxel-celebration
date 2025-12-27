import React from 'react';
import { Box } from '@react-three/drei';

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
  return (
    <Box args={[1, 1, 1]} position={position} scale={scale} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.8}
      />
    </Box>
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

