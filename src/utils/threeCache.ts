import * as THREE from 'three';

const sharedBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sharedBoxVertexColors = new Float32Array(
  sharedBoxGeometry.attributes.position.count * 3
).fill(1);
sharedBoxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(sharedBoxVertexColors, 3));

type VoxelMaterialOptions = Readonly<{
  color?: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  toneMapped?: boolean;
}>;

const voxelMaterialCache = new Map<string, THREE.MeshStandardMaterial>();

function voxelMaterialKey(opts: VoxelMaterialOptions): string {
  const color = opts.color ?? '#ffffff';
  const roughness = opts.roughness ?? 0.8;
  const metalness = opts.metalness ?? 0;
  const emissive = opts.emissive ?? '';
  const emissiveIntensity = opts.emissiveIntensity ?? 0;
  const toneMapped = opts.toneMapped ?? true;
  return `${color}|${roughness}|${metalness}|${emissive}|${emissiveIntensity}|${toneMapped ? 1 : 0}`;
}

export function getSharedBoxGeometry(): THREE.BoxGeometry {
  return sharedBoxGeometry;
}

export function getVoxelMaterial(opts: VoxelMaterialOptions = {}): THREE.MeshStandardMaterial {
  const key = voxelMaterialKey(opts);
  const cached = voxelMaterialCache.get(key);
  if (cached) return cached;

  const material = new THREE.MeshStandardMaterial({
    color: opts.color ?? '#ffffff',
    roughness: opts.roughness ?? 0.8,
    metalness: opts.metalness ?? 0,
    emissive: opts.emissive ?? '#000000',
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    toneMapped: opts.toneMapped ?? true,
    vertexColors: false,
  });

  voxelMaterialCache.set(key, material);
  return material;
}

let fireworksParticleMaterial: THREE.MeshBasicMaterial | null = null;

export function getFireworksParticleMaterial(): THREE.MeshBasicMaterial {
  if (fireworksParticleMaterial) return fireworksParticleMaterial;

  fireworksParticleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
    vertexColors: false,
  });

  return fireworksParticleMaterial;
}
