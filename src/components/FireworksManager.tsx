import { useLayoutEffect, useRef, type FC } from 'react';
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

// Max number of simultaneous particles
const MAX_PARTICLES = 2000;
const FIREWORK_BRIGHTNESS = 10;
const GRAVITY = 9.8 * 0.5;

export const FireworksManager: FC<FireworksManagerProps> = ({ rockets, removeRocket }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Particle State stored in refs for performance (no re-renders on update)
  const particles = useRef<ParticleData[]>([]);
  const particlePool = useRef<ParticleData[]>([]);
  const explosionScratch = useRef<ParticleData[]>([]);

  const instanceMatrixAttrRef = useRef<THREE.InstancedBufferAttribute | null>(null);
  const instanceMatrixArrayRef = useRef<Float32Array | null>(null);
  const instanceColorAttrRef = useRef<THREE.InstancedBufferAttribute | null>(null);
  const instanceColorArrayRef = useRef<Float32Array | null>(null);
  const matrixUpdateRangeRef = useRef({ start: 0, count: 0 });
  const colorUpdateRangeRef = useRef({ start: 0, count: 0 });

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

    instanceMatrixAttrRef.current = mesh.instanceMatrix;
    instanceMatrixArrayRef.current = mesh.instanceMatrix.array as Float32Array;
    instanceColorAttrRef.current = mesh.instanceColor;
    instanceColorArrayRef.current = mesh.instanceColor.array as Float32Array;

    const pool = particlePool.current;
    const missing = MAX_PARTICLES - pool.length;
    for (let i = 0; i < missing; i++) {
      pool.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        color: new THREE.Color(),
        scale: 0,
        life: 0,
        decay: 0,
      });
    }
  }, []);

  useFrame((_state, delta) => {
    // 1. Handle Rockets (Visuals handled by RocketComponent below, logic here is just cleanup if needed)
    // Actually, we will render rockets as individual components for simplicity of animation,
    // but the EXPLOSION logic happens here.

    // 2. Handle Particles
    const mesh = meshRef.current;
    if (mesh) {
      if (!instanceMatrixAttrRef.current) {
        instanceMatrixAttrRef.current = mesh.instanceMatrix;
        instanceMatrixArrayRef.current = mesh.instanceMatrix.array as Float32Array;
      }

      if (!instanceColorAttrRef.current && mesh.instanceColor) {
        instanceColorAttrRef.current = mesh.instanceColor;
        instanceColorArrayRef.current = mesh.instanceColor.array as Float32Array;
      }

      const instanceMatrix = instanceMatrixAttrRef.current;
      const instanceMatrixArray = instanceMatrixArrayRef.current;
      const instanceColor = instanceColorAttrRef.current;
      const instanceColorArray = instanceColorArrayRef.current;

      if (!instanceMatrix || !instanceMatrixArray) return;

      const activeParticles = particles.current;
      let i = 0;
      while (i < activeParticles.length) {
        const p = activeParticles[i];

        // Physics
        p.life -= delta * p.decay;
        p.velocity.y -= GRAVITY * delta;
        p.position.x += p.velocity.x * delta;
        p.position.y += p.velocity.y * delta;
        p.position.z += p.velocity.z * delta;

        // Update Instance
        if (p.life > 0 && p.position.y > 0) {
          const scale = p.scale * p.life;

          const m = i * 16;
          instanceMatrixArray[m] = scale;
          instanceMatrixArray[m + 1] = 0;
          instanceMatrixArray[m + 2] = 0;
          instanceMatrixArray[m + 3] = 0;
          instanceMatrixArray[m + 4] = 0;
          instanceMatrixArray[m + 5] = scale;
          instanceMatrixArray[m + 6] = 0;
          instanceMatrixArray[m + 7] = 0;
          instanceMatrixArray[m + 8] = 0;
          instanceMatrixArray[m + 9] = 0;
          instanceMatrixArray[m + 10] = scale;
          instanceMatrixArray[m + 11] = 0;
          instanceMatrixArray[m + 12] = p.position.x;
          instanceMatrixArray[m + 13] = p.position.y;
          instanceMatrixArray[m + 14] = p.position.z;
          instanceMatrixArray[m + 15] = 1;

          if (instanceColor && instanceColorArray) {
            const c = p.color;
            const o = i * 3;
            instanceColorArray[o] = c.r * FIREWORK_BRIGHTNESS;
            instanceColorArray[o + 1] = c.g * FIREWORK_BRIGHTNESS;
            instanceColorArray[o + 2] = c.b * FIREWORK_BRIGHTNESS;
          }
          i++;
        } else {
          // Remove particle (swap with last and pop)
          particlePool.current.push(p);
          activeParticles[i] = activeParticles[activeParticles.length - 1];
          activeParticles.pop();
        }
      }

      mesh.count = activeParticles.length;

      if (mesh.count > 0) {
        const matrixRange = matrixUpdateRangeRef.current;
        matrixRange.start = 0;
        matrixRange.count = mesh.count * 16;
        instanceMatrix.updateRanges.push(matrixRange);
        instanceMatrix.needsUpdate = true;

        if (instanceColor && instanceColorArray) {
          const colorRange = colorUpdateRangeRef.current;
          colorRange.start = 0;
          colorRange.count = mesh.count * 3;
          instanceColor.updateRanges.push(colorRange);
          instanceColor.needsUpdate = true;
        }
      }
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

const Rocket: FC<{
  data: RocketData;
  onExplode: (pos: THREE.Vector3, color: string) => void;
}> = ({ data, onExplode }) => {
  const ref = useRef<THREE.Group>(null);
  const speed = 15;

  useFrame((state, delta) => {
    if (!ref.current) return;

    const { newY, exploded } = stepRocketPosition(
      ref.current.position.y,
      speed,
      delta,
      data.targetHeight
    );
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
