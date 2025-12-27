import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Voxel } from './VoxelUtils';
import { COLORS } from '../constants';
import * as THREE from 'three';

interface HouseProps {
  position: [number, number, number];
  onShootRocket: (startPos: THREE.Vector3, color: string) => void;
  rotation?: number;
  width?: number;
  height?: number;
  depth?: number;
}

const House: React.FC<HouseProps> = ({ 
  position, 
  onShootRocket, 
  rotation = 0,
  width = 4,
  height = 3,
  depth = 4
}) => {
  const [x, y, z] = position;
  const [litWindows, setLitWindows] = useState<boolean[]>([]);
  const nextShootTime = useRef(Math.random() * 5 + 2); // Random start delay

  // Initialize random windows
  useEffect(() => {
    const wins = Array(4).fill(false).map(() => Math.random() > 0.3);
    setLitWindows(wins);
  }, []);

  useFrame((state, delta) => {
    nextShootTime.current -= delta;
    if (nextShootTime.current <= 0) {
      // Shoot!
      const randomColor = COLORS.fireworks[Math.floor(Math.random() * COLORS.fireworks.length)];
      
      // Calculate launch position from chimney
      // Chimney local position relative to group origin: [width/4, height + 2, depth/4]
      // We need to rotate this offset by the house rotation
      const offset = new THREE.Vector3(width / 4, height + 2, depth / 4);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      
      const launchPos = new THREE.Vector3(x, y, z).add(offset);
      
      onShootRocket(launchPos, randomColor);
      
      // Reset timer (random between 5 and 15 seconds)
      nextShootTime.current = Math.random() * 10 + 5;
    }
  });

  return (
    <group position={[x, y, z]} rotation={[0, rotation, 0]}>
      {/* Base Structure */}
      <Voxel position={[0, height / 2, 0]} scale={[width, height, depth]} color={COLORS.wood} />

      {/* Roof Layers */}
      <Voxel 
        position={[0, height + 0.5, 0]} 
        scale={[width + 0.6, 1, depth + 0.6]} 
        color={COLORS.roof} 
      />
      <Voxel 
        position={[0, height + 1.5, 0]} 
        scale={[width * 0.7, 1, depth * 0.7]} 
        color={COLORS.roof} 
      />
      <Voxel 
        position={[0, height + 2.25, 0]} 
        scale={[width * 0.4, 0.5, depth * 0.4]} 
        color={COLORS.roof} 
      />

      {/* Chimney */}
      <Voxel 
        position={[width / 4, height + 1.5, depth / 4]} 
        scale={[1, 2, 1]}
        color={COLORS.stone} 
      />

      {/* Door */}
      <Voxel 
        position={[0, 1, depth / 2 + 0.05]} 
        scale={[width * 0.25, 2, 0.1]} 
        color="#3e2723" 
      />
      
      {/* Windows with emission */}
      {/* Front Left */}
      <Voxel 
        position={[-width / 4, height * 0.6, depth / 2 + 0.05]} 
        scale={[width * 0.2, height * 0.25, 0.1]} 
        color={litWindows[0] ? COLORS.windowLit : COLORS.windowDark}
        emissive={litWindows[0] ? COLORS.windowLit : undefined}
        emissiveIntensity={litWindows[0] ? 1 : 0}
      />
      {/* Front Right */}
      <Voxel 
        position={[width / 4, height * 0.6, depth / 2 + 0.05]} 
        scale={[width * 0.2, height * 0.25, 0.1]} 
        color={litWindows[1] ? COLORS.windowLit : COLORS.windowDark}
        emissive={litWindows[1] ? COLORS.windowLit : undefined}
        emissiveIntensity={litWindows[1] ? 1 : 0}
      />
       {/* Side Left */}
       <Voxel 
        position={[-width / 2 - 0.05, height * 0.6, 0]} 
        scale={[0.1, height * 0.25, depth * 0.2]} 
        color={litWindows[2] ? COLORS.windowLit : COLORS.windowDark}
        emissive={litWindows[2] ? COLORS.windowLit : undefined}
        emissiveIntensity={litWindows[2] ? 1 : 0}
      />
      
      {/* Ambient glow from house if windows are lit */}
      <pointLight position={[0, 2, depth / 2 + 1]} intensity={0.5} color="orange" distance={5} />
    </group>
  );
};

export default House;