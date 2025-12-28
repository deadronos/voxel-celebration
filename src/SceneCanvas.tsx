import { Suspense, useCallback, useEffect, useState, lazy } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { DynamicResScaler } from './components/DynamicResScaler';
import { RocketData } from './types';

const SceneWorld = lazy(() => import('./SceneWorld'));
const SceneAtmosphere = lazy(() => import('./SceneAtmosphere'));
const SceneLanterns = lazy(() => import('./SceneLanterns'));
const ScenePostProcessing = lazy(() => import('./ScenePostProcessing'));
const SceneControls = lazy(() => import('./SceneControls'));
const FireworksManager = lazy(() =>
  import('./components/FireworksManager').then((module) => ({ default: module.FireworksManager }))
);

type IdleDeadline = { timeRemaining: () => number; didTimeout: boolean };
type IdleCallbackHandle = number;
type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: (deadline: IdleDeadline) => void,
    options?: { timeout: number }
  ) => IdleCallbackHandle;
  cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
};

export const scheduleIdle = (callback: () => void, timeout: number): (() => void) => {
  if (typeof window === 'undefined') {
    callback();
    return () => {};
  }

  const win = window as IdleWindow;

  if (win.requestIdleCallback) {
    const handle = win.requestIdleCallback(() => callback(), { timeout });
    return () => {
      win.cancelIdleCallback?.(handle);
    };
  }

  const handle = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(handle);
};

function FirstPaintGround() {
  return (
    <mesh position={[0, -2.5, 0]} receiveShadow>
      <boxGeometry args={[80, 1, 80]} />
      <meshStandardMaterial color="#151d33" />
    </mesh>
  );
}

function WebGLContextListener({ onChange }: { onChange: (lost: boolean) => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (event: Event) => {
      event.preventDefault();
      onChange(true);
    };

    const handleRestored = () => {
      onChange(false);
    };

    canvas.addEventListener('webglcontextlost', handleLost, { passive: false });
    canvas.addEventListener('webglcontextrestored', handleRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl, onChange]);

  return null;
}

type SceneProps = {
  enableWorld: boolean;
  enableAtmosphere: boolean;
  enableLanterns: boolean;
  enableFireworks: boolean;
  enablePostProcessing: boolean;
  rockets: RocketData[];
  onShootRocket: (startPos: THREE.Vector3, color: string) => void;
  removeRocket: (id: string) => void;
};

function Scene({
  enableWorld,
  enableAtmosphere,
  enableLanterns,
  enableFireworks,
  enablePostProcessing,
  rockets,
  onShootRocket,
  removeRocket,
}: SceneProps) {
  const enableShadows = enableWorld;

  return (
    <>
      <color attach="background" args={['#050510']} />

      <DynamicResScaler />

      <fog attach="fog" args={['#0b0026', 15, 60]} />

      <ambientLight intensity={0.4} color="#332255" />
      <hemisphereLight intensity={0.5} groundColor="#000022" color="#5533aa" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        color="#8888ff"
        castShadow={enableShadows}
      />

      <spotLight
        position={[-20, 30, -20]}
        intensity={4}
        color="#00ffff"
        angle={0.8}
        penumbra={0.5}
        castShadow={enableShadows}
      />

      {!enableWorld && <FirstPaintGround />}

      {enableWorld && (
        <Suspense fallback={null}>
          <SceneWorld onShootRocket={onShootRocket} />
        </Suspense>
      )}

      {enableAtmosphere && (
        <Suspense fallback={null}>
          <SceneAtmosphere />
        </Suspense>
      )}

      {enableLanterns && (
        <Suspense fallback={null}>
          <SceneLanterns />
        </Suspense>
      )}

      {enableFireworks && (
        <Suspense fallback={null}>
          <FireworksManager rockets={rockets} removeRocket={removeRocket} />
        </Suspense>
      )}

      {enableWorld && (
        <Suspense fallback={null}>
          <SceneControls />
        </Suspense>
      )}

      {enablePostProcessing && (
        <Suspense fallback={null}>
          <ScenePostProcessing />
        </Suspense>
      )}
    </>
  );
}

export default function SceneCanvas() {
  const [rockets, setRockets] = useState<RocketData[]>([]);
  const [enableWorld, setEnableWorld] = useState(false);
  const [enableAtmosphere, setEnableAtmosphere] = useState(false);
  const [enableLanterns, setEnableLanterns] = useState(false);
  const [enableFireworks, setEnableFireworks] = useState(false);
  const [enablePostProcessing, setEnablePostProcessing] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const handleShootRocket = useCallback((startPos: THREE.Vector3, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const targetHeight = 8 + Math.random() * 7;

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

  useEffect(() => {
    const cleanup = [
      scheduleIdle(() => setEnableWorld(true), 400),
      scheduleIdle(() => setEnableAtmosphere(true), 700),
      scheduleIdle(() => setEnableLanterns(true), 1000),
      scheduleIdle(() => setEnableFireworks(true), 1300),
      scheduleIdle(() => setEnablePostProcessing(true), 1600),
    ];

    return () => {
      cleanup.forEach((cancel) => cancel());
    };
  }, []);

  useEffect(() => {
    const cancelPrefetch = scheduleIdle(() => {
      void import('./SceneWorld');
      void import('./SceneAtmosphere');
      void import('./SceneLanterns');
      void import('./ScenePostProcessing');
      void import('./components/FireworksManager');
      void import('./SceneControls');
    }, 500);

    return cancelPrefetch;
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={1}
        camera={{ position: [20, 15, 20], fov: 45 }}
        gl={{ powerPreference: 'high-performance' }}
      >
        <WebGLContextListener onChange={setContextLost} />
        <Scene
          enableWorld={enableWorld}
          enableAtmosphere={enableAtmosphere}
          enableLanterns={enableLanterns}
          enableFireworks={enableFireworks}
          enablePostProcessing={enablePostProcessing}
          rockets={rockets}
          onShootRocket={handleShootRocket}
          removeRocket={removeRocket}
        />
      </Canvas>

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050510]/80 text-blue-100 text-sm tracking-[0.3em] uppercase">
          WebGL context lost. Please reload the page.
        </div>
      )}
    </div>
  );
}
