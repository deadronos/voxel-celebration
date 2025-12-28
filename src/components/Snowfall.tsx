import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SNOW_COUNT = 1500;
const RANGE = 60; // Spread of snow

export const Snowfall: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Create initial positions
  const positions = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RANGE;     // x
      pos[i * 3 + 1] = Math.random() * 30;            // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * RANGE; // z
    }
    return pos;
  }, []);

  // Store speeds for each particle
  const speeds = useMemo(() => {
    const s = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      s[i] = 1 + Math.random() * 2; // Fall speed
    }
    return s;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // We can access the buffer attribute directly
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < SNOW_COUNT; i++) {
      // Update Y
      posArray[i * 3 + 1] -= speeds[i] * delta;

      // Reset if below ground (assuming ground is around y=0 or -1, let's reset at -2)
      if (posArray[i * 3 + 1] < -2) {
        posArray[i * 3 + 1] = 30; // Reset to top
        posArray[i * 3] = (Math.random() - 0.5) * RANGE; // Randomize X slightly?
        posArray[i * 3 + 2] = (Math.random() - 0.5) * RANGE; // Randomize Z slightly?
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SNOW_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
