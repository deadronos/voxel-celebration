import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Voxel } from './VoxelUtils';
import * as THREE from 'three';

interface SkyLanternProps {
  position: readonly [number, number, number];
  color?: string;
}

const SkyLanternComponent: React.FC<SkyLanternProps> = ({ position, color = '#ff5722' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  // Store initial X/Z to drift around them
  const [initialPos] = useState(new THREE.Vector3(...position));

  // Random offsets to ensure lanterns don't move in perfect sync
  const [randomOffset] = useState(Math.random() * 100);
  const speed = 0.5 + Math.random() * 0.5;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime + randomOffset;

    // Continuous Upward movement
    groupRef.current.position.y += speed * delta;

    // Reset to bottom if it goes too high (looping effect)
    if (groupRef.current.position.y > 40) {
      groupRef.current.position.y = -5;
    }

    // Organic Horizontal drift using sine waves
    groupRef.current.position.x = initialPos.x + Math.sin(time * 0.5) * 2;
    groupRef.current.position.z = initialPos.z + Math.cos(time * 0.3) * 2;

    // Gentle sway rotation
    groupRef.current.rotation.z = Math.sin(time * 1) * 0.05;
    groupRef.current.rotation.x = Math.cos(time * 0.8) * 0.05;

    // Light Burst logic
    if (lightRef.current) {
      // Base flicker (candle effect) - mix of slow sine and fast random noise
      let intensity = 1.0 + Math.sin(time * 3) * 0.2 + (Math.random() - 0.5) * 0.4;

      // Periodic Burst: When sine wave peaks, boost intensity significantly
      // Period is roughly 12 seconds (2 * PI / 0.5)
      if (Math.sin(time * 0.5) > 0.9) {
        intensity += 3;
      }

      // Ensure intensity stays positive and has a minimum glow
      lightRef.current.intensity = Math.max(0.1, intensity);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Lantern Body - slightly translucent looking via emissive */}
      <Voxel
        position={[0, 0, 0]}
        scale={[0.8, 1.2, 0.8]}
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />

      {/* Light Source inside */}
      <pointLight ref={lightRef} color="#ffaa00" distance={10} decay={2} />
    </group>
  );
};

export const SkyLantern = React.memo(SkyLanternComponent);
SkyLantern.displayName = 'SkyLantern';
