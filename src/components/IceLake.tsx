import { memo, useMemo, type FC } from 'react';
import { useThree } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';

const MIN_REFLECT_RESOLUTION = 256;
const MAX_REFLECT_RESOLUTION = 512;
const BASE_REFLECT_RESOLUTION = 256;

const IceLakeComponent: FC = () => {
  const dpr = useThree((state) => state.viewport.dpr);

  const reflectorResolution = useMemo(() => {
    const scaled = Math.round(BASE_REFLECT_RESOLUTION * Math.min(dpr, 2));
    return Math.min(MAX_REFLECT_RESOLUTION, Math.max(MIN_REFLECT_RESOLUTION, scaled));
  }, [dpr]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[200, 60]}
        resolution={reflectorResolution}
        mixBlur={1}
        mixStrength={30}
        roughness={0.12}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#152030"
        metalness={0.6}
        mirror={0.9}
      />
    </mesh>
  );
};

export const IceLake = memo(IceLakeComponent);
