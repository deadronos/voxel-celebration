import { useLayoutEffect, useMemo, useRef, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Voxel } from './VoxelUtils';
import { RocketData } from '@/types';
import { writeExplosionParticles, type ParticleSoABuffers } from '@/utils/fireworks';
import { stepRocketPosition } from '@/utils/rocket';
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

  const particleCountRef = useRef(0);
  const particleBuffers = useMemo(
    () =>
      ({
        position: new Float32Array(MAX_PARTICLES * 3),
        velocity: new Float32Array(MAX_PARTICLES * 3),
        color: new Float32Array(MAX_PARTICLES * 3),
        scale: new Float32Array(MAX_PARTICLES),
        life: new Float32Array(MAX_PARTICLES),
        decay: new Float32Array(MAX_PARTICLES),
      }) satisfies ParticleSoABuffers,
    []
  );

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

      const positions = particleBuffers.position;
      const velocities = particleBuffers.velocity;
      const colors = particleBuffers.color;
      const scales = particleBuffers.scale;
      const lifes = particleBuffers.life;
      const decays = particleBuffers.decay;

      let count = particleCountRef.current;
      let i = 0;
      while (i < count) {
        const i3 = i * 3;

        // Physics
        const nextLife = lifes[i] - delta * decays[i];
        lifes[i] = nextLife;

        velocities[i3 + 1] -= GRAVITY * delta;

        positions[i3] += velocities[i3] * delta;
        positions[i3 + 1] += velocities[i3 + 1] * delta;
        positions[i3 + 2] += velocities[i3 + 2] * delta;

        if (nextLife > 0 && positions[i3 + 1] > 0) {
          const scale = scales[i] * nextLife;

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
          instanceMatrixArray[m + 12] = positions[i3];
          instanceMatrixArray[m + 13] = positions[i3 + 1];
          instanceMatrixArray[m + 14] = positions[i3 + 2];
          instanceMatrixArray[m + 15] = 1;

          if (instanceColor && instanceColorArray) {
            const o = i * 3;
            instanceColorArray[o] = colors[i3] * FIREWORK_BRIGHTNESS;
            instanceColorArray[o + 1] = colors[i3 + 1] * FIREWORK_BRIGHTNESS;
            instanceColorArray[o + 2] = colors[i3 + 2] * FIREWORK_BRIGHTNESS;
          }
          i++;
        } else {
          const last = count - 1;
          if (i !== last) {
            const last3 = last * 3;
            positions[i3] = positions[last3];
            positions[i3 + 1] = positions[last3 + 1];
            positions[i3 + 2] = positions[last3 + 2];

            velocities[i3] = velocities[last3];
            velocities[i3 + 1] = velocities[last3 + 1];
            velocities[i3 + 2] = velocities[last3 + 2];

            colors[i3] = colors[last3];
            colors[i3 + 1] = colors[last3 + 1];
            colors[i3 + 2] = colors[last3 + 2];

            scales[i] = scales[last];
            lifes[i] = lifes[last];
            decays[i] = decays[last];
          }

          count--;
        }
      }

      particleCountRef.current = count;
      mesh.count = count;

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

  const addExplosion = (position: THREE.Vector3, color: string) => {
    const start = particleCountRef.current;
    if (start >= MAX_PARTICLES) return;

    const written = writeExplosionParticles(particleBuffers, start, MAX_PARTICLES, position, color);
    particleCountRef.current = start + written;
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

  useFrame((_state, delta) => {
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
