import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Voxel } from './VoxelUtils';
import { ParticleData, RocketData } from '../types';
import { createExplosionParticles } from '../utils/fireworks';
import { stepRocketPosition } from '../utils/rocket';

interface FireworksManagerProps {
  rockets: RocketData[];
  removeRocket: (id: string) => void;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Max number of simultaneous particles
const MAX_PARTICLES = 2000;

export const FireworksManager: React.FC<FireworksManagerProps> = ({ rockets, removeRocket }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Particle State stored in refs for performance (no re-renders on update)
  const particles = useRef<ParticleData[]>([]);

  useFrame((state, delta) => {
    // 1. Handle Rockets (Visuals handled by RocketComponent below, logic here is just cleanup if needed)
    // Actually, we will render rockets as individual components for simplicity of animation,
    // but the EXPLOSION logic happens here.

    // 2. Handle Particles
    if (meshRef.current) {
      const activeParticles = particles.current;
      let i = 0;
      while (i < activeParticles.length) {
        const p = activeParticles[i];

        // Physics
        p.life -= delta * p.decay;
        p.velocity.y -= 9.8 * delta * 0.5; // Gravity
        p.position.add(p.velocity.clone().multiplyScalar(delta));

        // Update Instance
        if (p.life > 0 && p.position.y > 0) {
          tempObject.position.copy(p.position);
          // Scale down as life fades
          const scale = p.scale * p.life;
          tempObject.scale.set(scale, scale, scale);
          tempObject.updateMatrix();

          meshRef.current.setMatrixAt(i, tempObject.matrix);
          meshRef.current.setColorAt(i, p.color);
          i++;
        } else {
          // Remove particle (swap with last and pop)
          activeParticles[i] = activeParticles[activeParticles.length - 1];
          activeParticles.pop();
        }
      }

      meshRef.current.count = activeParticles.length;
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Function exposed via a custom event or ref would be better, but for this structure:
  // We need a way to add explosion particles.
  // We will pass a "RegisterExplosion" function via context or handle it via a "Rocket" component that reports back.

  // Alternative: The Rocket components are children here. When they die, they call an internal addExplosion.

  // Use helper to generate explosion particles (pure & testable)
  const addExplosion = (position: THREE.Vector3, color: string) => {
    const newParticles = createExplosionParticles(position, color);
    for (let i = 0; i < newParticles.length; i++) {
      if (particles.current.length >= MAX_PARTICLES) break;
      particles.current.push(newParticles[i]);
    }
  };

  return (
    <>
      {/* The Particles Instanced Mesh */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} vertexColors={false} />
      </instancedMesh>

      {/* Render Active Rockets */}
      {rockets.map((rocket) => (
        <Rocket
          key={rocket.id}
          data={rocket}
          onExplode={(pos, col) => {
            addExplosion(pos, col);
            removeRocket(rocket.id);
          }}
        />
      ))}
    </>
  );
};

const Rocket: React.FC<{
  data: RocketData;
  onExplode: (pos: THREE.Vector3, color: string) => void;
}> = ({ data, onExplode }) => {
  const ref = useRef<THREE.Group>(null);
  const speed = 15;

  useFrame((state, delta) => {
    if (!ref.current) return;

    const { newY, exploded } = stepRocketPosition(ref.current.position.y, speed, delta, data.targetHeight);
    ref.current.position.y = newY;

    if (exploded) {
      onExplode(ref.current.position, data.color);
    }
  });

  return (
    <group ref={ref} position={data.position}>
      <Voxel
        position={[0, 0, 0]}
        scale={[0.4, 0.8, 0.4]}
        color={data.color}
        emissive={data.color}
        emissiveIntensity={4}
      />
      {/* Trail */}
      <pointLight color={data.color} intensity={2} distance={3} decay={2} />
    </group>
  );
};

