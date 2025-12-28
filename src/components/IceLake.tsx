import type { FC } from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

export const IceLake: FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40} // Increased for more visible reflections
        roughness={0.1}  // Low roughness for ice
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#152030"
        metalness={0.6}
        mirror={1} // Mirror 1 = perfect reflection
      />
    </mesh>
  );
};
