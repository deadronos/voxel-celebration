import { useRef, type FC } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneInteractionProps {
  onShoot: (pos: THREE.Vector3, color: string) => void;
}

const SceneInteraction: FC<SceneInteractionProps> = ({ onShoot }) => {
  const camera = useThree((state) => state.camera);
  const raycaster = useThree((state) => state.raycaster);
  const pointer = useThree((state) => state.pointer);

  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 2)); // Level with ground at y=-2

  const handleClick = () => {
    raycaster.setFromCamera(pointer, camera);
    const target = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(planeRef.current, target)) {
      // Pick a random festive color
      const colors = ['#ff0044', '#00ff88', '#0088ff', '#ffcc00', '#ff00ff', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      onShoot(target, color);
    }
  };

  return (
    <mesh
      visible={false}
      onPointerDown={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

export default SceneInteraction;
