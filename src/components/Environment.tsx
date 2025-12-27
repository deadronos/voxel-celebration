import React from 'react';
import { Voxel } from './VoxelUtils';
import { COLORS } from '../constants';

export const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Trunk */}
      <Voxel position={[0, 0, 0]} color={COLORS.wood} />
      <Voxel position={[0, 1, 0]} color={COLORS.wood} />

      {/* Leaves */}
      <Voxel position={[0, 2, 0]} color={COLORS.leaves} />
      <Voxel position={[1, 2, 0]} color={COLORS.leaves} />
      <Voxel position={[-1, 2, 0]} color={COLORS.leaves} />
      <Voxel position={[0, 2, 1]} color={COLORS.leaves} />
      <Voxel position={[0, 2, -1]} color={COLORS.leaves} />

      <Voxel position={[0, 3, 0]} color={COLORS.leaves} />
    </group>
  );
};

export const StreetLight: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      <Voxel position={[0, 0, 0]} color={COLORS.stone} />
      <Voxel position={[0, 1, 0]} color={COLORS.stone} />
      <Voxel position={[0, 2, 0]} color={COLORS.stone} />
      <Voxel position={[0, 3, 0]} color={COLORS.stone} />

      {/* Light fixture */}
      <Voxel position={[0, 4, 0]} color="#ffffff" emissive="#fffacd" emissiveIntensity={2} />
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={10} color="#fffacd" decay={2} />
    </group>
  );
};

export const Ground: React.FC = () => {
  // Create a voxel grid for the ground
  const size = 30;
  const voxels = [];

  for (let x = -size; x <= size; x += 2) {
    for (let z = -size; z <= size; z += 2) {
      // Randomly choose between grass and snow for a winter vibe
      const isSnow = Math.random() > 0.8;
      const height = Math.random() > 0.85 ? 1 : 0; // Occasional bump

      voxels.push(
        <Voxel
          key={`${x}-${z}`}
          position={[x, height - 1, z]}
          color={isSnow ? COLORS.snow : COLORS.ground}
          scale={[2, 2, 2]} // Creating a "floor" using scaled voxels
        />
      );
    }
  }

  return <group>{voxels}</group>;
};

