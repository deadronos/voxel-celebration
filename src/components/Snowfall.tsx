import { useMemo, useRef, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SNOW_COUNT = 1500;
const RANGE = 60; // Spread of snow

const vertexShader = `
  uniform float time;
  uniform float range;
  attribute float speed;
  varying float vOpacity;

  void main() {
    vec3 pos = position;
    // Animate Y position based on time and speed
    // Use modulo to wrap around
    float yOffset = mod(time * speed, 32.0); // 30 (height) + 2 (buffer)
    pos.y -= yOffset;

    if (pos.y < -2.0) {
        pos.y += 32.0;
    }

    // Add some sway
    pos.x += sin(time * 0.5 + pos.y) * 0.5;
    pos.z += cos(time * 0.3 + pos.x) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation
    gl_PointSize = 0.15 * (300.0 / -mvPosition.z);

    // Fade out near bottom
    vOpacity = smoothstep(-2.0, 0.0, pos.y);
  }
`;

const fragmentShader = `
  varying float vOpacity;

  void main() {
    // Circle shape
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8 * vOpacity);
  }
`;

export const Snowfall: FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create initial positions and speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const spd = new Float32Array(SNOW_COUNT);

    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RANGE; // x
      pos[i * 3 + 1] = Math.random() * 30; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * RANGE; // z

      spd[i] = 1 + Math.random() * 2; // Fall speed
    }
    return [pos, spd];
  }, []);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    range: { value: RANGE }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SNOW_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={SNOW_COUNT}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={uniforms}
      />
    </points>
  );
};
