import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Stats, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Components
import { Ground, Tree, StreetLight } from './components/Environment';
import House from './components/House';
import { FireworksManager } from './components/FireworksManager';
import { SkyLantern } from './components/SkyLantern';
import { RocketData } from './types';

function Scene() {
  const [rockets, setRockets] = useState<RocketData[]>([]);

  const handleShootRocket = useCallback((startPos: THREE.Vector3, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const targetHeight = 15 + Math.random() * 10; // Explode between y=15 and y=25

    setRockets((prev) => [
      ...prev,
      {
        id,
        position: startPos,
        color,
        targetHeight,
      },
    ]);
  }, []);

  const removeRocket = useCallback((id: string) => {
    setRockets((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.1} color="#000033" />
      <directionalLight position={[10, 20, 10]} intensity={0.2} color="#4444ff" castShadow />

      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Cloud
        opacity={0.3}
        speed={0.4}
        bounds={[20, 2, 1.5]}
        segments={20}
        position={[0, 20, -10]}
        color="#111122"
      />

      <group position={[0, -2, 0]}>
        <Ground />

        {/* Village Layout */}
        <House
          position={[-8, 0, -8]}
          onShootRocket={handleShootRocket}
          rotation={Math.PI / 4}
          width={5}
          height={4}
          depth={5}
        />
        <House
          position={[8, 0, -8]}
          onShootRocket={handleShootRocket}
          rotation={-Math.PI / 4}
          width={4}
          height={3}
          depth={6}
        />
        <House
          position={[-8, 0, 8]}
          onShootRocket={handleShootRocket}
          rotation={Math.PI * 0.75}
          width={3}
          height={5}
          depth={3}
        />
        <House
          position={[8, 0, 8]}
          onShootRocket={handleShootRocket}
          rotation={-Math.PI * 0.75}
          width={6}
          height={3}
          depth={4}
        />
        <House
          position={[0, 0, -12]}
          onShootRocket={handleShootRocket}
          width={4}
          height={3}
          depth={4}
        />

        {/* Decorations */}
        <StreetLight position={[0, 0, 0]} />
        <StreetLight position={[-10, 0, 0]} />
        <StreetLight position={[10, 0, 0]} />
        <StreetLight position={[0, 0, 10]} />
        <StreetLight position={[0, 0, -5]} />

        <Tree position={[-5, 0, 5]} />
        <Tree position={[5, 0, 5]} />
        <Tree position={[-5, 0, -5]} />
        <Tree position={[5, 0, -5]} />
        <Tree position={[-12, 0, 0]} />
        <Tree position={[12, 0, 0]} />

        {/* Sky Lanterns */}
        <SkyLantern position={[-5, 5, -5]} />
        <SkyLantern position={[5, 8, 2]} />
        <SkyLantern position={[0, 12, 8]} />
      </group>

      {/* Fireworks System */}
      <FireworksManager rockets={rockets} removeRocket={removeRocket} />

      <OrbitControls
        maxPolarAngle={Math.PI / 2 - 0.1}
        minDistance={10}
        maxDistance={40}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Post Processing for the "Glow" effect */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
      </EffectComposer>
    </>
  );
}

function App() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-5 left-0 right-0 z-10 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] font-sans">
          Happy New Year
        </h1>
        <p className="text-blue-200 mt-2 text-sm tracking-wider opacity-80">Voxel Celebration</p>
      </div>

      <Canvas shadows camera={{ position: [20, 15, 20], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;

