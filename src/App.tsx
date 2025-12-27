import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Components
import { Ground, Tree, StreetLight } from './components/Environment';
import House from './components/House';
import { FireworksManager } from './components/FireworksManager';
import { SkyLantern } from './components/SkyLantern';
import { RocketData } from './types';

const HOUSES: ReadonlyArray<
  Readonly<{
    key: string;
    position: readonly [number, number, number];
    rotation?: number;
    width?: number;
    height?: number;
    depth?: number;
  }>
> = [
  { key: 'house-1', position: [-8, 0, -8], rotation: Math.PI / 4, width: 5, height: 4, depth: 5 },
  { key: 'house-2', position: [8, 0, -8], rotation: -Math.PI / 4, width: 4, height: 3, depth: 6 },
  { key: 'house-3', position: [-8, 0, 8], rotation: Math.PI * 0.75, width: 3, height: 5, depth: 3 },
  { key: 'house-4', position: [8, 0, 8], rotation: -Math.PI * 0.75, width: 6, height: 3, depth: 4 },
  { key: 'house-5', position: [0, 0, -12], width: 4, height: 3, depth: 4 },
];

const STREET_LIGHTS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 0, 0],
  [-10, 0, 0],
  [10, 0, 0],
  [0, 0, 10],
  [0, 0, -5],
];

const TREES: ReadonlyArray<readonly [number, number, number]> = [
  [-5, 0, 5],
  [5, 0, 5],
  [-5, 0, -5],
  [5, 0, -5],
  [-12, 0, 0],
  [12, 0, 0],
];

const SKY_LANTERNS: ReadonlyArray<readonly [number, number, number]> = [
  [-5, 5, -5],
  [5, 8, 2],
  [0, 12, 8],
];

function Scene() {
  const [rockets, setRockets] = useState<RocketData[]>([]);

  const handleShootRocket = useCallback((startPos: THREE.Vector3, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const targetHeight = 8 + Math.random() * 7; // Explode between y=8 and y=15 (lower)

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
      <ambientLight intensity={0.2} color="#222244" />
      <hemisphereLight intensity={0.3} groundColor="#000000" color="#222244" />
      <directionalLight position={[10, 20, 10]} intensity={0.4} color="#6666ff" castShadow />
      {/* Moon Light (Rim) */}
      <spotLight
        position={[-20, 20, -20]}
        intensity={2.5}
        color="#aaddff"
        angle={0.6}
        penumbra={1}
        castShadow
      />

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
        {HOUSES.map((house) => (
          <House
            key={house.key}
            position={house.position}
            onShootRocket={handleShootRocket}
            rotation={house.rotation}
            width={house.width}
            height={house.height}
            depth={house.depth}
          />
        ))}

        {/* Decorations */}
        {STREET_LIGHTS.map((pos) => (
          <StreetLight key={pos.join(',')} position={pos} />
        ))}

        {TREES.map((pos) => (
          <Tree key={pos.join(',')} position={pos} />
        ))}

        {/* Sky Lanterns */}
        {SKY_LANTERNS.map((pos) => (
          <SkyLantern key={pos.join(',')} position={pos} />
        ))}
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
