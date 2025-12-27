import * as THREE from 'three';
import type { ParticleData } from '../types';

export type RandomFn = () => number;

export function createExplosionParticles(
  position: THREE.Vector3,
  color: string,
  opts?: { random?: RandomFn; count?: number; out?: ParticleData[]; pool?: ParticleData[] }
): ParticleData[] {
  const rand: RandomFn = opts?.random ?? Math.random;
  const count = typeof opts?.count === 'number' ? opts.count : Math.floor(30 + rand() * 20);
  const baseColor = new THREE.Color(color);

  const particles = opts?.out ?? [];
  particles.length = 0;

  for (let i = 0; i < count; i++) {
    const pooled = opts?.pool?.pop();
    const particle: ParticleData =
      pooled ??
      ({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        color: new THREE.Color(),
        scale: 0,
        life: 0,
        decay: 0,
      } satisfies ParticleData);

    particle.position.copy(position);
    particle.velocity.set((rand() - 0.5) * 10, (rand() - 0.5) * 10, (rand() - 0.5) * 10);
    particle.color.copy(baseColor);

    particle.scale = 0.3 + rand() * 0.3;
    particle.life = 1.0;
    particle.decay = 0.5 + rand() * 0.5;

    particles.push(particle);
  }

  return particles;
}
