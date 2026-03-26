import * as THREE from 'three';
import type { ParticleData } from '../types';

export type RandomFn = () => number;

type ShapeType = 'burst' | 'sphere' | 'ring';

const tempBaseColor = new THREE.Color();
const TWO_PI = Math.PI * 2;

function getParticle(pool: ParticleData[] | undefined): ParticleData {
  return (
    pool?.pop() ??
    ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(),
      scale: 0,
      life: 0,
      decay: 0,
    } satisfies ParticleData)
  );
}

export function createExplosionParticles(
  position: THREE.Vector3,
  color: string,
  opts?: { random?: RandomFn; count?: number; out?: ParticleData[]; pool?: ParticleData[] }
): ParticleData[] {
  const rand: RandomFn = opts?.random ?? Math.random;
  // Increase default count for better shapes
  const count = typeof opts?.count === 'number' ? opts.count : Math.floor(50 + rand() * 50);
  const baseColor = tempBaseColor.set(color);

  const particles = opts?.out ?? [];
  particles.length = 0;

  // Randomly select a shape
  const shapeRoll = rand();
  let shape: ShapeType = 'burst';
  if (shapeRoll > 0.7) shape = 'sphere';
  else if (shapeRoll > 0.4) shape = 'ring';

  for (let i = 0; i < count; i++) {
    const particle = getParticle(opts?.pool);

    particle.position.copy(position);

    let vx = 0,
      vy = 0,
      vz = 0;
    const speed = 5 + rand() * 5;

    if (shape === 'sphere') {
      // Uniform point on sphere surface
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      vx = Math.sin(phi) * Math.cos(theta);
      vy = Math.sin(phi) * Math.sin(theta);
      vz = Math.cos(phi);
      // Add some randomness to speed
      const s = speed * (0.8 + rand() * 0.4);
      vx *= s;
      vy *= s;
      vz *= s;
    } else if (shape === 'ring') {
      // Ring on XZ plane (mostly)
      const angle = rand() * Math.PI * 2;
      vx = Math.cos(angle);
      vy = (rand() - 0.5) * 0.2; // slight vertical variation
      vz = Math.sin(angle);

      const s = speed * (0.9 + rand() * 0.2);
      vx *= s;
      vy *= s;
      vz *= s;
    } else {
      // Burst (Random cube volume)
      vx = (rand() - 0.5) * 10;
      vy = (rand() - 0.5) * 10;
      vz = (rand() - 0.5) * 10;
    }

    particle.velocity.set(vx, vy, vz);
    particle.color.copy(baseColor);

    // Variation in color?
    if (rand() > 0.8) {
      particle.color.offsetHSL(0.1, 0, 0);
    }

    particle.scale = 0.3 + rand() * 0.3;
    particle.life = 1.0;
    // Different shapes might decay differently
    particle.decay = 0.5 + rand() * 0.5;

    particles.push(particle);
  }

  return particles;
}

export type ParticleSoABuffers = Readonly<{
  position: Float32Array;
  velocity: Float32Array;
  color: Float32Array;
  scale: Float32Array;
  life: Float32Array;
  decay: Float32Array;
}>;

export function writeExplosionParticles(
  buffers: ParticleSoABuffers,
  startIndex: number,
  maxParticles: number,
  position: THREE.Vector3,
  color: string,
  opts?: { random?: RandomFn; count?: number }
): number {
  const rand: RandomFn = opts?.random ?? Math.random;
  const desiredCount = typeof opts?.count === 'number' ? opts.count : Math.floor(50 + rand() * 50);
  const available = Math.max(0, maxParticles - startIndex);
  const count = Math.min(desiredCount, available);
  if (count <= 0) return 0;

  const baseColor = tempBaseColor.set(color);
  const baseR = baseColor.r;
  const baseG = baseColor.g;
  const baseB = baseColor.b;

  const shapeRoll = rand();
  let shape: ShapeType = 'burst';
  if (shapeRoll > 0.7) shape = 'sphere';
  else if (shapeRoll > 0.4) shape = 'ring';

  const px = position.x;
  const py = position.y;
  const pz = position.z;

  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const o3 = idx * 3;

    buffers.position[o3] = px;
    buffers.position[o3 + 1] = py;
    buffers.position[o3 + 2] = pz;

    let vx = 0;
    let vy = 0;
    let vz = 0;
    const speed = 5 + rand() * 5;

    if (shape === 'sphere') {
      const theta = rand() * TWO_PI;
      const phi = Math.acos(2 * rand() - 1);
      const sinPhi = Math.sin(phi);
      vx = sinPhi * Math.cos(theta);
      vy = sinPhi * Math.sin(theta);
      vz = Math.cos(phi);

      const s = speed * (0.8 + rand() * 0.4);
      vx *= s;
      vy *= s;
      vz *= s;
    } else if (shape === 'ring') {
      const angle = rand() * TWO_PI;
      vx = Math.cos(angle);
      vy = (rand() - 0.5) * 0.2;
      vz = Math.sin(angle);

      const s = speed * (0.9 + rand() * 0.2);
      vx *= s;
      vy *= s;
      vz *= s;
    } else {
      vx = (rand() - 0.5) * 10;
      vy = (rand() - 0.5) * 10;
      vz = (rand() - 0.5) * 10;
    }

    buffers.velocity[o3] = vx;
    buffers.velocity[o3 + 1] = vy;
    buffers.velocity[o3 + 2] = vz;

    let r = baseR;
    let g = baseG;
    let b = baseB;
    if (rand() > 0.8) {
      const tint = 0.9 + rand() * 0.2;
      r = Math.min(1, r * tint);
      g = Math.min(1, g * tint);
      b = Math.min(1, b * tint);
    }

    buffers.color[o3] = r;
    buffers.color[o3 + 1] = g;
    buffers.color[o3 + 2] = b;

    buffers.scale[idx] = 0.3 + rand() * 0.3;
    buffers.life[idx] = 1.0;
    buffers.decay[idx] = 0.5 + rand() * 0.5;
  }

  return count;
}
