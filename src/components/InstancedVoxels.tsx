import { useLayoutEffect, useMemo, useRef, type FC } from 'react';
import * as THREE from 'three';
import { getSharedBoxGeometry, getVoxelMaterial } from '@/utils/threeCache';

export type VoxelInstance = Readonly<{
  position: readonly [number, number, number];
  color: string;
  scale?: readonly [number, number, number];
}>;

interface InstancedVoxelsProps {
  instances: readonly VoxelInstance[];
  material?: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export const InstancedVoxels: FC<InstancedVoxelsProps> = ({ 
  instances,
  material,
  castShadow = true,
  receiveShadow = true,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const sharedGeometry = getSharedBoxGeometry();
  const sharedMaterial = material ?? getVoxelMaterial();

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.count = instances.length;
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      tempObject.position.set(inst.position[0], inst.position[1], inst.position[2]);

      if (inst.scale) {
        tempObject.scale.set(inst.scale[0], inst.scale[1], inst.scale[2]);
      } else {
        tempObject.scale.set(1, 1, 1);
      }

      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      tempColor.set(inst.color);
      mesh.setColorAt(i, tempColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
  }, [instances, tempColor, tempObject]);

  if (instances.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[sharedGeometry, sharedMaterial, instances.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    ></instancedMesh>
  );
};
