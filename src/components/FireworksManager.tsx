import { useLayoutEffect, useRef, useMemo, useState, useEffect, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RocketData } from '@/types';
import { rocketStore } from '@/utils/rocketStore';
import { stepRocketPosition } from '@/utils/rocket';
import { getSharedBoxGeometry, getVoxelMaterial } from '@/utils/threeCache';

const MAX_PARTICLES = 8000;
const MAX_ROCKETS = 256;
const MAX_LIGHTS = 8;
const GRAVITY = 9.8 * 0.8;

/**
 * Fireworks particles are simulated on the CPU (positions, scale and HDR
 * colors) and written into the instanced mesh matrices/colors each frame.
 * Only live particles are drawn (`mesh.count`), so the draw stays tiny and
 * behaves consistently across browsers — including Safari/WebKit, which
 * dropped the previous GPU-driven custom shader when rendering through the
 * post-processing composer.
 */
const ParticleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  toneMapped: false,
});

const RocketMaterial = getVoxelMaterial({
  emissive: '#ffffff',
  emissiveIntensity: 2,
});

type ParticleState = {
  startPosition: Float32Array;
  velocity: Float32Array;
  color: Float32Array;
  startTime: Float32Array;
  duration: Float32Array;
  baseScale: Float32Array;
};

function createParticleState(): ParticleState {
  const create = (size: number) => new Float32Array(MAX_PARTICLES * size);
  return {
    startPosition: create(3),
    velocity: create(3),
    color: create(3),
    startTime: create(1),
    duration: create(1),
    baseScale: create(1),
  };
}

export const FireworksManager: FC = () => {
  const [rockets, setRockets] = useState<RocketData[]>([]);

  useEffect(() => {
    return rocketStore.subscribe(setRockets);
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const rocketMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const cursorRef = useRef(0);

  // Track visual Y positions to avoid mutating props directly
  const yPositionsRef = useRef<Map<string, number>>(new Map());

  // CPU-side particle state (ring buffer, indexed by cursorRef)
  const particleStateRef = useRef<ParticleState>(createParticleState());

  const tempRocket = useMemo(() => new THREE.Object3D(), []);
  const tempParticle = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize the particle mesh to all-dead state
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.count = 0;
    const identity = new THREE.Matrix4();
    for (let i = 0; i < MAX_PARTICLES; i++) {
      mesh.setMatrixAt(i, identity);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const state = particleStateRef.current;
    state.startTime.fill(-1000);
  }, []);

  const addExplosion = (position: THREE.Vector3, color: string) => {
    const state = particleStateRef.current;
    const count = Math.floor(60 + Math.random() * 40);
    const baseColor = tempColor.set(color);
    const instColor = new THREE.Color();

    let cursor = cursorRef.current;
    const brightness = 15;

    // Determine explosion shape
    const shapeRoll = Math.random();
    let shape: 'burst' | 'sphere' | 'ring' = 'burst';
    if (shapeRoll > 0.7) shape = 'sphere';
    else if (shapeRoll > 0.4) shape = 'ring';

    for (let i = 0; i < count; i++) {
      cursor = (cursor + 1) % MAX_PARTICLES;
      state.startPosition[cursor * 3] = position.x;
      state.startPosition[cursor * 3 + 1] = position.y;
      state.startPosition[cursor * 3 + 2] = position.z;

      let vx = 0;
      let vy = 0;
      let vz = 0;
      const speed = 6 + Math.random() * 6;

      if (shape === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        vx = Math.sin(phi) * Math.cos(theta);
        vy = Math.sin(phi) * Math.sin(theta);
        vz = Math.cos(phi);
        const s = speed * (0.8 + Math.random() * 0.4);
        vx *= s;
        vy *= s;
        vz *= s;
      } else if (shape === 'ring') {
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle);
        vy = (Math.random() - 0.5) * 0.2;
        vz = Math.sin(angle);
        const s = speed * (0.9 + Math.random() * 0.2);
        vx *= s;
        vy *= s;
        vz *= s;
      } else {
        vx = (Math.random() - 0.5) * 12;
        vy = (Math.random() - 0.5) * 12;
        vz = (Math.random() - 0.5) * 12;
      }

      state.velocity[cursor * 3] = vx;
      state.velocity[cursor * 3 + 1] = vy;
      state.velocity[cursor * 3 + 2] = vz;

      instColor.copy(baseColor);
      if (Math.random() > 0.8) instColor.offsetHSL(0.05, 0, 0);
      state.color[cursor * 3] = instColor.r * brightness;
      state.color[cursor * 3 + 1] = instColor.g * brightness;
      state.color[cursor * 3 + 2] = instColor.b * brightness;

      state.duration[cursor] = 1.5 + Math.random() * 0.5;
      state.baseScale[cursor] = 0.25 + Math.random() * 0.25;
      // startTime is set when the frame timestamp is known (see useFrame)
      state.startTime[cursor] = -1;
    }

    cursorRef.current = cursor;
  };

  const addTrailParticle = (position: THREE.Vector3, color: string) => {
    const state = particleStateRef.current;
    const baseColor = tempColor.set(color);

    let cursor = cursorRef.current;
    cursor = (cursor + 1) % MAX_PARTICLES;

    state.startPosition[cursor * 3] = position.x;
    state.startPosition[cursor * 3 + 1] = position.y;
    state.startPosition[cursor * 3 + 2] = position.z;
    state.velocity[cursor * 3] = (Math.random() - 0.5) * 0.8;
    state.velocity[cursor * 3 + 1] = -1.5;
    state.velocity[cursor * 3 + 2] = (Math.random() - 0.5) * 0.8;
    state.color[cursor * 3] = baseColor.r * 5.0;
    state.color[cursor * 3 + 1] = baseColor.g * 5.0;
    state.color[cursor * 3 + 2] = baseColor.b * 5.0;
    state.duration[cursor] = 0.4 + Math.random() * 0.4;
    state.baseScale[cursor] = 0.1 + Math.random() * 0.1;
    state.startTime[cursor] = -1;

    cursorRef.current = cursor;
  };

  useFrame((state, delta) => {
    const uTime = state.clock.getElapsedTime();

    const rocketMesh = rocketMeshRef.current;
    const particleMesh = meshRef.current;
    if (!rocketMesh || !particleMesh) return;

    // Safety: cap rocket count to buffer size
    const activeCount = Math.min(rockets.length, MAX_ROCKETS);
    rocketMesh.count = activeCount;

    // Process rockets
    for (let i = 0; i < activeCount; i++) {
      const rocket = rockets[i];

      // Get or initialize current Y
      let currentY = yPositionsRef.current.get(rocket.id);
      if (currentY === undefined) {
        currentY = rocket.position.y;
        yPositionsRef.current.set(rocket.id, currentY);
      }

      const { newY, exploded } = stepRocketPosition(currentY, 15, delta, rocket.targetHeight);
      tempRocket.position.set(rocket.position.x, newY, rocket.position.z);
      if (!exploded) addTrailParticle(tempRocket.position, rocket.color);
      yPositionsRef.current.set(rocket.id, newY);

      // Update Matrix
      tempRocket.position.set(rocket.position.x, newY, rocket.position.z);
      tempRocket.scale.set(0.4, 0.8, 0.4);
      tempRocket.updateMatrix();
      rocketMesh.setMatrixAt(i, tempRocket.matrix);

      // Update Color
      tempColor.set(rocket.color);
      rocketMesh.setColorAt(i, tempColor);

      // Sync point lights (limited pool)
      if (i < MAX_LIGHTS) {
        const light = lightRefs.current[i];
        if (light) {
          light.position.set(rocket.position.x, newY, rocket.position.z);
          light.color.set(rocket.color);
          light.intensity = 15;
        }
      }

      if (exploded) {
        addExplosion(new THREE.Vector3(rocket.position.x, newY, rocket.position.z), rocket.color);
        yPositionsRef.current.delete(rocket.id);
        rocketStore.removeRocket(rocket.id);
      }
    }

    // Hide remaining lights
    for (let i = activeCount; i < MAX_LIGHTS; i++) {
      const light = lightRefs.current[i];
      if (light) light.intensity = 0;
    }

    // Compact live particles into the instanced draw and update matrices/colors
    const particle = particleStateRef.current;
    let write = 0;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const age = uTime - particle.startTime[i];
      const duration = particle.duration[i];
      if (particle.startTime[i] < 0 || age < 0 || age > duration) continue;

      const progress = age / duration;
      const scale = particle.baseScale[i] * (1 - progress);

      const px = particle.startPosition[i * 3] + particle.velocity[i * 3] * age;
      const py =
        particle.startPosition[i * 3 + 1] +
        particle.velocity[i * 3 + 1] * age -
        0.5 * GRAVITY * age * age;
      const pz = particle.startPosition[i * 3 + 2] + particle.velocity[i * 3 + 2] * age;

      tempParticle.position.set(px, py, pz);
      tempParticle.scale.set(scale, scale, scale);
      tempParticle.updateMatrix();
      particleMesh.setMatrixAt(write, tempParticle.matrix);

      tempColor.setRGB(
        particle.color[i * 3],
        particle.color[i * 3 + 1],
        particle.color[i * 3 + 2],
        THREE.LinearSRGBColorSpace
      );
      particleMesh.setColorAt(write, tempColor);
      write++;
    }

    // Stamp the current sim time on particles born this frame
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (particle.startTime[i] === -1) particle.startTime[i] = uTime;
    }

    particleMesh.count = write;
    particleMesh.instanceMatrix.needsUpdate = true;
    if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;

    rocketMesh.instanceMatrix.needsUpdate = true;
    if (rocketMesh.instanceColor) rocketMesh.instanceColor.needsUpdate = true;

    // Cleanup stale entries in yPositionsRef
    if (rockets.length === 0 && yPositionsRef.current.size > 0) {
      yPositionsRef.current.clear();
    }
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[getSharedBoxGeometry(), ParticleMaterial, MAX_PARTICLES]}
        frustumCulled={false}
        dispose={null}
      />
      <instancedMesh
        ref={rocketMeshRef}
        args={[getSharedBoxGeometry(), RocketMaterial, MAX_ROCKETS]}
        frustumCulled={false}
        dispose={null}
      />
      {Array.from({ length: MAX_LIGHTS }).map((_, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            lightRefs.current[i] = el;
          }}
          distance={10}
          decay={2}
          intensity={0}
        />
      ))}
    </>
  );
};
