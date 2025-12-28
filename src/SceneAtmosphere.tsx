import React from 'react';
import { Cloud, Stars } from '@react-three/drei';

import { AuroraSky } from './components/AuroraSky';

export default function SceneAtmosphere() {
  return (
    <>
      <AuroraSky />
      <Stars radius={100} depth={60} count={8000} factor={6} saturation={0.9} fade speed={2} />
      <Cloud
        opacity={0.4}
        speed={0.2}
        bounds={[40, 6, 4]}
        segments={30}
        position={[0, 25, -20]}
        color="#221133"
      />
    </>
  );
}
