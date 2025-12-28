import React, { Suspense } from 'react';

const SceneCanvas = React.lazy(() => import('./SceneCanvas'));

function App() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-5 left-0 right-0 z-10 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] font-sans">
          Happy New Year
        </h1>
        <p className="text-blue-200 mt-2 text-sm tracking-wider opacity-80">Voxel Celebration</p>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#050510] via-[#0b0026] to-[#0f1730]">
            <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_50%_20%,rgba(90,120,255,0.25),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#0f1528]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0d17] to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-blue-100/80 text-xs tracking-[0.3em] uppercase">
              Loading scene...
            </div>
          </div>
        }
      >
        <SceneCanvas />
      </Suspense>
    </div>
  );
}

export default App;
