import React, { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Voxel } from './VoxelUtils';
import { ParticleData, RocketData } from '../types';
import { createExplosionParticles } from '../utils/fireworks';
import { stepRocketPosition } from '../utils/rocket';
import { getFireworksParticleMaterial, getSharedBoxGeometry } from '@/utils/threeCache';

interface FireworksManagerProps {
  rockets: RocketData[];
  removeRocket: (id: string) => void;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Max number of simultaneous particles
const MAX_PARTICLES = 2000;
const FIREWORK_BRIGHTNESS = 10;

export const FireworksManager: React.FC<FireworksManagerProps> = ({ rockets, removeRocket }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Particle State stored in refs for performance (no re-renders on update)
  const particles = useRef<ParticleData[]>([]);
  const particlePool = useRef<ParticleData[]>([]);
  const explosionScratch = useRef<ParticleData[]>([]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.count = 0;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    if (!mesh.instanceColor) {
      const colors = new Float32Array(MAX_PARTICLES * 3);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      mesh.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    // 1. Handle Rockets (Visuals handled by RocketComponent below, logic here is just cleanup if needed)
    // Actually, we will render rockets as individual components for simplicity of animation,
    // but the EXPLOSION logic happens here.

    // 2. Handle Particles
    const mesh = meshRef.current;
    if (mesh) {
      const activeParticles = particles.current;
      let i = 0;
      while (i < activeParticles.length) {
        const p = activeParticles[i];

        // Physics
        p.life -= delta * p.decay;
        p.velocity.y -= 9.8 * delta * 0.5; // Gravity
        p.position.addScaledVector(p.velocity, delta);

        // Update Instance
        if (p.life > 0 && p.position.y > 0) {
          tempObject.position.copy(p.position);
          // Scale down as life fades
          const scale = p.scale * p.life;
          tempObject.scale.set(scale, scale, scale);
          tempObject.updateMatrix();

          mesh.setMatrixAt(i, tempObject.matrix);
          tempColor.copy(p.color).multiplyScalar(FIREWORK_BRIGHTNESS);
          mesh.setColorAt(i, tempColor);
          i++;
        } else {
          // Remove particle (swap with last and pop)
          particlePool.current.push(p);
          activeParticles[i] = activeParticles[activeParticles.length - 1];
          activeParticles.pop();
        }
      }

      mesh.count = activeParticles.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  // Function exposed via a custom event or ref would be better, but for this structure:
  // We need a way to add explosion particles.
  // We will pass a "RegisterExplosion" function via context or handle it via a "Rocket" component that reports back.

  // Alternative: The Rocket components are children here. When they die, they call an internal addExplosion.

  // Use helper to generate explosion particles (pure & testable)
  const addExplosion = (position: THREE.Vector3, color: string) => {
    const available = MAX_PARTICLES - particles.current.length;
    if (available <= 0) return;

    const newParticles = createExplosionParticles(position, color, {
      out: explosionScratch.current,
      pool: particlePool.current,
    });

    for (let i = 0; i < newParticles.length; i++) {
      if (particles.current.length >= MAX_PARTICLES) {
        particlePool.current.push(newParticles[i]);
        continue;
      }

      particles.current.push(newParticles[i]);
    }

    explosionScratch.current.length = 0;
  };

  return (
    <>
      {/* The Particles Instanced Mesh */}
      <instancedMesh
        ref={meshRef}
        args={[getSharedBoxGeometry(), getFireworksParticleMaterial(), MAX_PARTICLES]}
        frustumCulled={false}
        dispose={null}
      />

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
    <group ref={ref} position={[data.position.x, data.position.y, data.position.z]}>
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
