import { useLayoutEffect, useRef, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Voxel } from './VoxelUtils';
import { RocketData } from '@/types';
import { stepRocketPosition } from '@/utils/rocket';
import { getSharedBoxGeometry } from '@/utils/threeCache';

interface FireworksManagerProps {
  rockets: RocketData[];
  removeRocket: (id: string) => void;
}

const MAX_PARTICLES = 4000;
const GRAVITY = 9.8 * 0.5;

// Custom Shader Material for GPU-based particles
const FireworksShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uGravity: { value: GRAVITY },
  },
  vertexShader: `
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

      // Calculate scale based on age
      float progress = age / aDuration;
      float scale = aBaseScale * (1.0 - progress);

      // If particle is not yet born or dead, scale to 0
      if (age < 0.0 || age > aDuration) {
        scale = 0.0;
      }

      // Physics Position
      vec3 pos = aStartPosition + aVelocity * age;
      pos.y -= 0.5 * uGravity * age * age;

      // Transform the box geometry
      // We scale the box relative to its center, then translate
      vec3 transformed = position * scale;
      vec3 finalPos = pos + transformed;

      vColor = aColor;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  vertexColors: true,
  side: THREE.FrontSide, // Box is closed
});

export const FireworksManager: FC<FireworksManagerProps> = ({ rockets, removeRocket }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const cursorRef = useRef(0);

  // Buffer references
  const attrRefs = useRef<{
    aStartPosition: THREE.InstancedBufferAttribute;
    aVelocity: THREE.InstancedBufferAttribute;
    aColor: THREE.InstancedBufferAttribute;
    aStartTime: THREE.InstancedBufferAttribute;
    aDuration: THREE.InstancedBufferAttribute;
    aBaseScale: THREE.InstancedBufferAttribute;
  } | null>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Set instance count to max immediately
    mesh.count = MAX_PARTICLES;

    // Initialize Identity Matrix for all instances (though we ignore it in shader mostly)
    // Actually we don't use instanceMatrix in shader, so we can ignore it.
    // But InstancedMesh might expect it.
    const identity = new THREE.Matrix4();
    for (let i = 0; i < MAX_PARTICLES; i++) {
      mesh.setMatrixAt(i, identity);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Create Instanced Attributes
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

    // Initialize buffers with "dead" state (startTime = -1000)
    for (let i = 0; i < MAX_PARTICLES; i++) {
      attrs.aStartTime.setX(i, -1000);
    }
    attrs.aStartTime.needsUpdate = true;
  }, []);

  useFrame((state) => {
    FireworksShaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const addExplosion = (position: THREE.Vector3, color: string) => {
    const attrs = attrRefs.current;
    if (!attrs) return;

    const count = Math.floor(50 + Math.random() * 50);
    // Use the time from the shader uniform which is updated in useFrame
    const currentTime = FireworksShaderMaterial.uniforms.uTime.value as number;

    const baseColor = new THREE.Color(color);
    const tempColor = new THREE.Color();

    let cursor = cursorRef.current;

    // Shape logic
    const shapeRoll = Math.random();
    let shape = 'burst';
    if (shapeRoll > 0.7) shape = 'sphere';
    else if (shapeRoll > 0.4) shape = 'ring';

    const brightness = 10; // High brightness for "glow" look in shader (if tone mapped)
    // Our shader output is vec4(vColor, 1.0), handled by postprocessing bloom usually.
    // Standard Fireworks was MeshBasicMaterial, so we output >1 values.

    for (let i = 0; i < count; i++) {
      cursor = (cursor + 1) % MAX_PARTICLES;

      // Position
      attrs.aStartPosition.setXYZ(cursor, position.x, position.y, position.z);

      // Velocity
      let vx = 0,
        vy = 0,
        vz = 0;
      const speed = 5 + Math.random() * 5;

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
        vx = (Math.random() - 0.5) * 10;
        vy = (Math.random() - 0.5) * 10;
        vz = (Math.random() - 0.5) * 10;
      }
      attrs.aVelocity.setXYZ(cursor, vx, vy, vz);

      // Color
      tempColor.copy(baseColor);
      if (Math.random() > 0.8) tempColor.offsetHSL(0.1, 0, 0);
      attrs.aColor.setXYZ(
        cursor,
        tempColor.r * brightness,
        tempColor.g * brightness,
        tempColor.b * brightness
      );

      // Timing
      attrs.aStartTime.setX(cursor, currentTime);

      const decay = 0.5 + Math.random() * 0.5;
      const life = 1.0;
      attrs.aDuration.setX(cursor, life / decay);

      attrs.aBaseScale.setX(cursor, 0.3 + Math.random() * 0.3);
    }

    cursorRef.current = cursor;

    // Mark ranges for update?
    // Since it's a ring buffer, we updated `count` items at `start`.
    // Actually we jumped around if we wrapped.
    // For simplicity, mark all as needing update or try to be smart.
    // InstancedBufferAttribute.needsUpdate = true updates the whole buffer.
    // `updateRange` can be used.

    // Simplest: update everything.
    attrs.aStartPosition.needsUpdate = true;
    attrs.aVelocity.needsUpdate = true;
    attrs.aColor.needsUpdate = true;
    attrs.aStartTime.needsUpdate = true;
    attrs.aDuration.needsUpdate = true;
    attrs.aBaseScale.needsUpdate = true;
  };

  return (
    <>
      {/* The Particles Instanced Mesh */}
      <instancedMesh
        ref={meshRef}
        args={[getSharedBoxGeometry(), FireworksShaderMaterial, MAX_PARTICLES]}
        frustumCulled={false}
        dispose={null}
      />

      {/* Render Active Rockets */}
      {rockets.map((rocket) => (
        <Rocket
          key={rocket.id}
          data={rocket}
          onExplode={(pos, col) => {
            addExplosion(pos, col);
            removeRocket(rocket.id);
          }}
        />
      ))}
    </>
  );
};

const Rocket: FC<{
  data: RocketData;
  onExplode: (pos: THREE.Vector3, color: string) => void;
}> = ({ data, onExplode }) => {
  const ref = useRef<THREE.Group>(null);
  const speed = 15;

  useFrame((_state, delta) => {
    if (!ref.current) return;

    const { newY, exploded } = stepRocketPosition(
      ref.current.position.y,
      speed,
      delta,
      data.targetHeight
    );
    ref.current.position.y = newY;

    if (exploded) {
      onExplode(ref.current.position, data.color);
    }
  });

  return (
    <group ref={ref} position={[data.position.x, data.position.y, data.position.z]}>
      <Voxel
        position={[0, 0, 0]}
        scale={[0.4, 0.8, 0.4]}
        color={data.color}
        emissive={data.color}
        emissiveIntensity={4}
      />
      {/* Trail */}
      <pointLight color={data.color} intensity={2} distance={3} decay={2} />
    </group>
  );
};
