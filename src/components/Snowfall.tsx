import { useLayoutEffect, useMemo, useRef, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SNOW_COUNT = 1500;
const RANGE = 60; // Spread of snow

export const Snowfall: FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const positionAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const positionArrayRef = useRef<Float32Array | null>(null);

  // Create initial positions
  const positions = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RANGE; // x
      pos[i * 3 + 1] = Math.random() * 30; // y
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

  useLayoutEffect(() => {
    const points = pointsRef.current;
    if (!points) return;

    const posAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    positionAttrRef.current = posAttr;
    positionArrayRef.current = posAttr.array as Float32Array;
  }, []);

  useFrame((_state, delta) => {
    const posAttr = positionAttrRef.current;
    const posArray = positionArrayRef.current;
    if (!posAttr || !posArray) return;

    for (let i = 0, j = 0; i < SNOW_COUNT; i++, j += 3) {
      // Update Y
      posArray[j + 1] -= speeds[i] * delta;

      // Reset if below ground (assuming ground is around y=0 or -1, let's reset at -2)
      if (posArray[j + 1] < -2) {
        posArray[j + 1] = 30; // Reset to top
        posArray[j] = (Math.random() - 0.5) * RANGE;
        posArray[j + 2] = (Math.random() - 0.5) * RANGE;
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
