import { useLayoutEffect, useMemo, useRef, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RocketData } from '@/types';
import { stepRocketPosition } from '@/utils/rocket';
import { getSharedBoxGeometry } from '@/utils/threeCache';

interface FireworksManagerProps {
  rockets: RocketData[];
  removeRocket: (id: string) => void;
}

const MAX_PARTICLES = 4000;
const MAX_ROCKETS = 50;
const MAX_LIGHTS = 8;
const GRAVITY = 9.8 * 0.5;

/**
 * Custom Shader Material for GPU-based particles.
 * Calculates position and scale based on time and initial velocity.
 */
const FireworksShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uGravity: { value: GRAVITY },
  },
  vertexShader: `
    precision highp float;

    uniform float uTime;
    uniform float uGravity;

    attribute vec3 aStartPosition;
    attribute vec3 aVelocity;
    attribute vec3 aColor;
    attribute float aStartTime;
    attribute float aDuration;
    attribute float aBaseScale;

    varying vec3 vColor;

    void main() {
      float age = uTime - aStartTime;
      float progress = age / aDuration;
      float scale = aBaseScale * (1.0 - progress);

      // If particle is not yet born or dead, hide it
      if (age < 0.0 || age > aDuration) {
        scale = 0.0;
      }

      // Physics: s = ut + 0.5at^2
      vec3 pos = aStartPosition + aVelocity * age;
      pos.y -= 0.5 * uGravity * age * age;

      // Transform the box geometry
      vec3 transformed = position * scale;
      vec3 finalPos = pos + transformed;

      vColor = aColor;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  vertexColors: true,
  side: THREE.FrontSide,
});

const RocketMaterial = new THREE.MeshStandardMaterial({
  toneMapped: true,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 2,
});

export const FireworksManager: FC<FireworksManagerProps> = ({ rockets, removeRocket }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const rocketMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const cursorRef = useRef(0);

  // Track visual Y positions to avoid mutating props directly
  const yPositionsRef = useRef<Map<string, number>>(new Map());

  // Buffer references for particle attributes
  const attrRefs = useRef<{
    aStartPosition: THREE.InstancedBufferAttribute;
    aVelocity: THREE.InstancedBufferAttribute;
    aColor: THREE.InstancedBufferAttribute;
    aStartTime: THREE.InstancedBufferAttribute;
    aDuration: THREE.InstancedBufferAttribute;
    aBaseScale: THREE.InstancedBufferAttribute;
  } | null>(null);

  // Initialize particle buffers
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.count = MAX_PARTICLES;
    const identity = new THREE.Matrix4();
    for (let i = 0; i < MAX_PARTICLES; i++) {
      mesh.setMatrixAt(i, identity);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const createAttr = (size: number) => {
      const attr = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PARTICLES * size), size);
      attr.setUsage(THREE.DynamicDrawUsage);
      return attr;
    };

    const attrs = {
      aStartPosition: createAttr(3),
      aVelocity: createAttr(3),
      aColor: createAttr(3),
      aStartTime: createAttr(1),
      aDuration: createAttr(1),
      aBaseScale: createAttr(1),
    };

    mesh.geometry.setAttribute('aStartPosition', attrs.aStartPosition);
    mesh.geometry.setAttribute('aVelocity', attrs.aVelocity);
    mesh.geometry.setAttribute('aColor', attrs.aColor);
    mesh.geometry.setAttribute('aStartTime', attrs.aStartTime);
    mesh.geometry.setAttribute('aDuration', attrs.aDuration);
    mesh.geometry.setAttribute('aBaseScale', attrs.aBaseScale);

    attrRefs.current = attrs;

    // Initialize as dead
    for (let i = 0; i < MAX_PARTICLES; i++) {
      attrs.aStartTime.setX(i, -1000);
    }
    attrs.aStartTime.needsUpdate = true;
  }, []);

  const tempRocket = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const addExplosion = (position: THREE.Vector3, color: string) => {
    const attrs = attrRefs.current;
    if (!attrs) return;

    const count = Math.floor(60 + Math.random() * 40);
    const currentTime = FireworksShaderMaterial.uniforms.uTime.value as number;
    const baseColor = new THREE.Color(color);
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
      attrs.aStartPosition.setXYZ(cursor, position.x, position.y, position.z);

      let vx = 0, vy = 0, vz = 0;
      const speed = 6 + Math.random() * 6;

      if (shape === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        vx = Math.sin(phi) * Math.cos(theta);
        vy = Math.sin(phi) * Math.sin(theta);
        vz = Math.cos(phi);
        const s = speed * (0.8 + Math.random() * 0.4);
        vx *= s; vy *= s; vz *= s;
      } else if (shape === 'ring') {
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle);
        vy = (Math.random() - 0.5) * 0.2;
        vz = Math.sin(angle);
        const s = speed * (0.9 + Math.random() * 0.2);
        vx *= s; vy *= s; vz *= s;
      } else {
        vx = (Math.random() - 0.5) * 12;
        vy = (Math.random() - 0.5) * 12;
        vz = (Math.random() - 0.5) * 12;
      }

      attrs.aVelocity.setXYZ(cursor, vx, vy, vz);

      instColor.copy(baseColor);
      if (Math.random() > 0.8) instColor.offsetHSL(0.05, 0, 0);
      attrs.aColor.setXYZ(cursor, instColor.r * brightness, instColor.g * brightness, instColor.b * brightness);

      attrs.aStartTime.setX(cursor, currentTime);
      attrs.aDuration.setX(cursor, 1.5 + Math.random() * 0.5);
      attrs.aBaseScale.setX(cursor, 0.25 + Math.random() * 0.25);
    }

    cursorRef.current = cursor;
    attrs.aStartPosition.needsUpdate = true;
    attrs.aVelocity.needsUpdate = true;
    attrs.aColor.needsUpdate = true;
    attrs.aStartTime.needsUpdate = true;
    attrs.aDuration.needsUpdate = true;
    attrs.aBaseScale.needsUpdate = true;
  };

  useFrame((state, delta) => {
    // Update global shader time
    FireworksShaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime();

    const mesh = rocketMeshRef.current;
    if (!mesh) return;

    // Safety: cap rocket count to buffer size
    const activeCount = Math.min(rockets.length, MAX_ROCKETS);
    mesh.count = activeCount;

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
      yPositionsRef.current.set(rocket.id, newY);

      // Update Matrix
      tempRocket.position.set(rocket.position.x, newY, rocket.position.z);
      tempRocket.scale.set(0.4, 0.8, 0.4);
      tempRocket.updateMatrix();
      mesh.setMatrixAt(i, tempRocket.matrix);

      // Update Color
      tempColor.set(rocket.color);
      mesh.setColorAt(i, tempColor);

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
        removeRocket(rocket.id);
      }
    }

    // Hide remaining lights
    for (let i = activeCount; i < MAX_LIGHTS; i++) {
      const light = lightRefs.current[i];
      if (light) light.intensity = 0;
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Cleanup stale entries in yPositionsRef
    if (rockets.length === 0 && yPositionsRef.current.size > 0) {
      yPositionsRef.current.clear();
    }
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[getSharedBoxGeometry(), FireworksShaderMaterial, MAX_PARTICLES]}
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
          ref={(el) => { lightRefs.current[i] = el; }}
          distance={10}
          decay={2}
          intensity={0}
        />
      ))}
    </>
  );
};
