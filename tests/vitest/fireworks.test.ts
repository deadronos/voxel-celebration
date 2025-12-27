import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createExplosionParticles } from '@/utils/fireworks';

describe('createExplosionParticles', () => {
  it('generates deterministic particles with provided random', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const rand = () => 0.5;
    const parts = createExplosionParticles(position, '#ff0000', { random: rand });

    // 30 + 0.5 * 20 = 40
    expect(parts.length).toBe(40);

    for (const p of parts) {
      expect(p.position.x).toBeCloseTo(1);
      expect(p.position.y).toBeCloseTo(2);
      expect(p.position.z).toBeCloseTo(3);

      // With rand=0.5, velocities should be (0,0,0)
      expect(p.velocity.x).toBeCloseTo(0);
      expect(p.velocity.y).toBeCloseTo(0);
      expect(p.velocity.z).toBeCloseTo(0);

      // scale = 0.3 + 0.5 * 0.3 = 0.45
      expect(p.scale).toBeCloseTo(0.45);

      // decay = 0.5 + 0.5 * 0.5 = 0.75
      expect(p.decay).toBeCloseTo(0.75);

      expect(p.color.equals(new THREE.Color('#ff0000'))).toBe(true);
      expect(p.life).toBeCloseTo(1.0);
    }
  });

  it('respects count override', () => {
    const pos = new THREE.Vector3();
    const parts = createExplosionParticles(pos, '#00ff00', { random: () => 0, count: 5 });
    expect(parts.length).toBe(5);
  });

  it('generates values in expected ranges with random 0', () => {
    const pos = new THREE.Vector3();
    const parts = createExplosionParticles(pos, '#00ff00', { random: () => 0 });
    expect(parts.length).toBe(30);
    for (const p of parts) {
      expect(p.scale).toBeGreaterThanOrEqual(0.3);
      expect(p.scale).toBeLessThan(0.6);
      expect(p.decay).toBeGreaterThanOrEqual(0.5);
      expect(p.decay).toBeLessThan(1.0 + Number.EPSILON);
    }
  });
});
