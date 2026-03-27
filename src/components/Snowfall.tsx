import { useMemo, useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SNOW_COUNT = 3000;
const RANGE = 60; // Spread of snow

const vertexShader = `
  uniform float time;
  uniform float range;
  attribute float speed;
  attribute float aSize;
  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // Vertical motion
    float yOffset = mod(time * speed, 32.0);
    pos.y -= yOffset;
    if (pos.y < -2.0) pos.y += 32.0;

    // Enhanced swirl/sway motion
    float swirl = time * 0.4;
    pos.x += sin(swirl + pos.y * 0.2) * 1.5;
    pos.z += cos(swirl * 0.8 + pos.x * 0.2) * 1.5;

    // Additional micro-jitter
    pos.x += sin(time * 2.0 + float(gl_VertexID)) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Varied point sizes
    gl_PointSize = aSize * (300.0 / -mvPosition.z);

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
    const [positions, speeds, sizes] = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const spd = new Float32Array(SNOW_COUNT);
    const sz = new Float32Array(SNOW_COUNT);

    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RANGE;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * RANGE;

      spd[i] = 0.8 + Math.random() * 1.5;
      sz[i] = 0.08 + Math.random() * 0.15;
    }
    return [pos, spd, sz];
  }, []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      range: { value: RANGE },
    }),
    [],
  );

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
        <bufferAttribute attach="attributes-speed" count={SNOW_COUNT} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={SNOW_COUNT} array={sizes} itemSize={1} />
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
