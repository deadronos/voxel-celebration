import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createExplosionParticles, RandomFn } from '@/utils/fireworks';

describe('createExplosionParticles', () => {
  it('generates deterministic particles with provided random', () => {
    // 0.5 > 0.4 and 0.5 < 0.7, so shape 'ring'
    const rand: RandomFn = () => 0.5;
    const position = new THREE.Vector3(1, 2, 3);
    const parts = createExplosionParticles(position, '#ff0000', { random: rand });

    // 50 + 0.5 * 50 = 75
    expect(parts.length).toBe(75);

    for (const p of parts) {
      expect(p.position.x).toBeCloseTo(1);
      expect(p.position.y).toBeCloseTo(2);
      expect(p.position.z).toBeCloseTo(3);

      expect(p.color.equals(new THREE.Color('#ff0000'))).toBe(true);
      expect(p.life).toBeCloseTo(1.0);
    }
  });

  it('respects count override', () => {
    const pos = new THREE.Vector3();
    const parts = createExplosionParticles(pos, '#00ff00', { random: () => 0, count: 5 });
    expect(parts.length).toBe(5);
  });

  it('generates sphere distribution when rand > 0.7', () => {
     const pos = new THREE.Vector3();
     // Use a mock random that returns 0.8 initially for shape selection
     // then other values
     let callCount = 0;
     const mockRand = () => {
         callCount++;
         if (callCount === 1) return 0.8; // Shape: sphere
         return 0.5;
     };

     const parts = createExplosionParticles(pos, '#00ff00', { random: mockRand, count: 10 });
     expect(parts.length).toBe(10);
     // Sphere logic: x, y, z set by spherical coords
     // Just verify they are not all 0 or infinity
     parts.forEach(p => {
         expect(p.velocity.length()).toBeGreaterThan(0);
     });
  });

    it('generates ring distribution when rand is between 0.4 and 0.7', () => {
     const pos = new THREE.Vector3();
     // Use a mock random that returns 0.5 initially for shape selection
     let callCount = 0;
     const mockRand = () => {
         callCount++;
         if (callCount === 1) return 0.5; // Shape: ring
         return 0.5;
     };

     const parts = createExplosionParticles(pos, '#00ff00', { random: mockRand, count: 10 });
     expect(parts.length).toBe(10);
     parts.forEach(p => {
          expect(p.velocity.length()).toBeGreaterThan(0);
     });
  });
});
