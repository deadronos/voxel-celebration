import { useMemo, useEffect, memo, type FC } from 'react';
import { InstancedVoxels, type VoxelInstance } from './InstancedVoxels';
import { COLORS } from '../constants';
import * as THREE from 'three';
import { getVoxelMaterial } from '@/utils/threeCache';

interface HouseProps {
  position: readonly [number, number, number];
  onShootRocket: (startPos: THREE.Vector3, color: string) => void;
  rotation?: number;
  width?: number;
  height?: number;
  depth?: number;
}

const yAxis = new THREE.Vector3(0, 1, 0);

const House: FC<HouseProps> = ({
  position,
  onShootRocket,
  rotation = 0,
  width = 4,
  height = 3,
  depth = 4,
}) => {
  const [x, y, z] = position;

  const litWindows = useMemo(() => Array.from({ length: 3 }, () => Math.random() > 0.3), []);
  const litWindowMaterial = getVoxelMaterial({ emissive: COLORS.windowLit, emissiveIntensity: 1 });

  const { solidInstances, litWindowInstances } = useMemo(() => {
    const solid: VoxelInstance[] = [
      { position: [0, height / 2, 0], scale: [width, height, depth], color: COLORS.wood },
      { position: [0, height + 0.5, 0], scale: [width + 0.6, 1, depth + 0.6], color: COLORS.roof },
      { position: [0, height + 1.5, 0], scale: [width * 0.7, 1, depth * 0.7], color: COLORS.roof },
      {
        position: [0, height + 2.25, 0],
        scale: [width * 0.4, 0.5, depth * 0.4],
        color: COLORS.roof,
      },
      { position: [width / 4, height + 1.5, depth / 4], scale: [1, 2, 1], color: COLORS.stone },
      { position: [0, 1, depth / 2 + 0.05], scale: [width * 0.25, 2, 0.1], color: '#3e2723' },
    ];

    const lit: VoxelInstance[] = [];

    const windows: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      lit: boolean;
    }> = [
      {
        position: [-width / 4, height * 0.6, depth / 2 + 0.05],
        scale: [width * 0.2, height * 0.25, 0.1],
        lit: litWindows[0],
      },
      {
        position: [width / 4, height * 0.6, depth / 2 + 0.05],
        scale: [width * 0.2, height * 0.25, 0.1],
        lit: litWindows[1],
      },
      {
        position: [-width / 2 - 0.05, height * 0.6, 0],
        scale: [0.1, height * 0.25, depth * 0.2],
        lit: litWindows[2],
      },
    ];

    for (const win of windows) {
      if (win.lit) {
        lit.push({ position: win.position, scale: win.scale, color: COLORS.windowLit });
      } else {
        solid.push({ position: win.position, scale: win.scale, color: COLORS.windowDark });
      }
    }

    return { solidInstances: solid, litWindowInstances: lit };
  }, [depth, height, litWindows, width]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      // Random delay between 5 and 15 seconds
      const delay = (Math.random() * 10 + 5) * 1000;

      timeoutId = setTimeout(() => {
        // Shoot!
        const randomColor = COLORS.fireworks[Math.floor(Math.random() * COLORS.fireworks.length)];

        // Calculate launch position from chimney
        // Chimney local position relative to group origin: [width/4, height + 2, depth/4]
        // We need to rotate this offset by the house rotation
        const offset = new THREE.Vector3(width / 4, height + 2, depth / 4);
        offset.applyAxisAngle(yAxis, rotation);

        const launchPos = new THREE.Vector3(x, y, z).add(offset);

        onShootRocket(launchPos, randomColor);

        // Schedule next shot
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [depth, height, onShootRocket, rotation, width, x, y, z]);

  return (
    <group position={[x, y, z]} rotation={[0, rotation, 0]}>
      <InstancedVoxels instances={solidInstances} />
      {litWindowInstances.length > 0 ? (
        <InstancedVoxels instances={litWindowInstances} material={litWindowMaterial} />
      ) : null}

      {/* Ambient glow from house if windows are lit */}
      {litWindows.some((isLit) => isLit) && (
        <pointLight
          position={[0, height / 2, depth / 2]}
          intensity={2}
          distance={8}
          decay={2}
          color="#ffaa00"
          castShadow={false}
        />
      )}
    </group>
  );
};

export default memo(House);
