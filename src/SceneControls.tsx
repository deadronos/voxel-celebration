import React from 'react';
import { OrbitControls } from '@react-three/drei';

export default function SceneControls() {
  return (
    <OrbitControls
      maxPolarAngle={Math.PI / 2 - 0.1}
      minDistance={10}
      maxDistance={60}
      autoRotate
      autoRotateSpeed={0.3}
    />
  );
}
