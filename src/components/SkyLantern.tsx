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

    // Generic organic drift (noise-like)
    const driftX = Math.sin(time * 0.3) * 1.5 + Math.cos(time * 0.7) * 0.5;
    const driftZ = Math.cos(time * 0.2) * 1.5 + Math.sin(time * 0.5) * 0.5;

    groupRef.current.position.x = initialPos.x + driftX;
    groupRef.current.position.z = initialPos.z + driftZ;

    // Bobbing motion integrated into sway
    // Apply speed
    groupRef.current.position.y += speed * delta;
    // Add bob to visual y position without affecting the base trajectory too much?
    // Actually, let's just add it to the rotation/sway to keep upward movement clean,
    // OR just modulate the Y slightly.
    // Let's keep Y linear for "rising" but maybe sway rotation is key.

    // Better: Sway/Tilt as if caught in wind
    // When moving X, tilt Z. When moving Z, tilt X.
    groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.15; // Rocking left/right
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.15; // Rocking forward/back

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
