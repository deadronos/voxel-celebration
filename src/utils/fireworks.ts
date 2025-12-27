import * as THREE from 'three';
import type { ParticleData } from '../types';

export type RandomFn = () => number;

export function createExplosionParticles(
  position: THREE.Vector3,
  color: string,
  opts?: { random?: RandomFn; count?: number }
): ParticleData[] {
  const rand: RandomFn = opts?.random ?? Math.random;
  const count = typeof opts?.count === 'number' ? opts.count : Math.floor(30 + rand() * 20);
  const baseColor = new THREE.Color(color);

  const particles: ParticleData[] = [];
  for (let i = 0; i < count; i++) {
    const velocity = new THREE.Vector3(
      (rand() - 0.5) * 10,
      (rand() - 0.5) * 10,
      (rand() - 0.5) * 10
    );

    particles.push({
      position: position.clone(),
      velocity,
      color: baseColor.clone(),
      scale: 0.3 + rand() * 0.3,
      life: 1.0,
      decay: 0.5 + rand() * 0.5,
    });
  }

  return particles;
}
