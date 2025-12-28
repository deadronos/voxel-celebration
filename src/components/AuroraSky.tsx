import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;
varying vec3 vPosition;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Coordinate for noise
  vec2 p = vUv * 8.0; 
  
  // Scrolling effect
  float time = uTime * 0.2;
  
  // Multiple layers of noise for detail
  float n1 = snoise(vec2(p.x, p.y - time));
  float n2 = snoise(vec2(p.x * 2.0 + time, p.y * 0.5 - time * 1.5));
  float n3 = snoise(vec2(p.x * 4.0 - time * 2.0, p.y * 2.0 + time * 0.5));
  
  float noise = n1 * 0.5 + n2 * 0.25 + n3 * 0.125;
  
  // Vertical curtain shape
  float brightness = smoothstep(-0.2, 0.6, noise);
  
  // Fade out at bottom and top
  float yGradient = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
  
  // Color Mixing
  vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
  color = mix(color, uColor3, n2 * 0.5 + 0.5);
  
  // Intensity
  float alpha = brightness * yGradient * 0.6;
  
  gl_FragColor = vec4(color, alpha);
}
`;

export function AuroraSky() {
  const mesh = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#38003b') }, // Deep purple
      uColor2: { value: new THREE.Color('#00b7ff') }, // Bright Cyan
      uColor3: { value: new THREE.Color('#ff0080') }, // Magenta
    }),
    []
  );

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial & {
        uniforms?: { uTime?: { value: number } };
      };
      if (material.uniforms?.uTime) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  return (
    <mesh ref={mesh} scale={[100, 100, 100]} position={[0, -10, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
