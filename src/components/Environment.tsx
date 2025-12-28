import { useMemo, memo, type FC } from 'react';
import { InstancedVoxels, type VoxelInstance } from './InstancedVoxels';
import { COLORS } from '../constants';
import { getVoxelMaterial } from '@/utils/threeCache';

const TreeComponent: FC<{ position: readonly [number, number, number] }> = ({ position }) => {
  const instances = useMemo<readonly VoxelInstance[]>(
    () => [
      { position: [0, 0, 0], color: COLORS.wood },
      { position: [0, 1, 0], color: COLORS.wood },
      { position: [0, 2, 0], color: COLORS.leaves },
      { position: [1, 2, 0], color: COLORS.leaves },
      { position: [-1, 2, 0], color: COLORS.leaves },
      { position: [0, 2, 1], color: COLORS.leaves },
      { position: [0, 2, -1], color: COLORS.leaves },
      { position: [0, 3, 0], color: COLORS.leaves },
    ],
    []
  );

  return (
    <group position={position}>
      <InstancedVoxels instances={instances} />
    </group>
  );
};

export const Tree = memo(TreeComponent);
Tree.displayName = 'Tree';

const StreetLightComponent: FC<{ position: readonly [number, number, number] }> = ({
  position,
}) => {
  const poleInstances = useMemo<readonly VoxelInstance[]>(
    () => [
      { position: [0, 0, 0], color: COLORS.stone },
      { position: [0, 1, 0], color: COLORS.stone },
      { position: [0, 2, 0], color: COLORS.stone },
      { position: [0, 3, 0], color: COLORS.stone },
    ],
    []
  );

  const fixtureInstances = useMemo<readonly VoxelInstance[]>(
    () => [{ position: [0, 4, 0], color: '#ffffff' }],
    []
  );
  // High intensity for Bloom
  const fixtureMaterial = getVoxelMaterial({ emissive: '#fffacd', emissiveIntensity: 0.8 });

  return (
    <group position={position}>
      <InstancedVoxels instances={poleInstances} />
      <InstancedVoxels instances={fixtureInstances} material={fixtureMaterial} />
      <pointLight position={[0, 5, 0]} intensity={0.8} distance={10} color="#fffacd" decay={2} />
    </group>
  );
};

export const StreetLight = memo(StreetLightComponent);
StreetLight.displayName = 'StreetLight';

const GroundComponent: FC = () => {
  const instances = useMemo<readonly VoxelInstance[]>(() => {
    const size = 30;
    const step = 2;
    const voxels: VoxelInstance[] = [];

    for (let x = -size; x <= size; x += step) {
      for (let z = -size; z <= size; z += step) {
        const isSnow = Math.random() > 0.8;
        const height = Math.random() > 0.85 ? 1 : 0;

        voxels.push({
          position: [x, height - 1, z],
          color: isSnow ? COLORS.snow : COLORS.ground,
          scale: [2, 2, 2],
        });
      }
    }

    return voxels;
  }, []);

  return (
    <group>
      <InstancedVoxels instances={instances} />
    </group>
  );
};

export const Ground = memo(GroundComponent);
Ground.displayName = 'Ground';
