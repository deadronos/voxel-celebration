# DES002: Atmospheric Overhaul Design

## Goal

Transform the "Voxel Celebration" scene from a generic dark void into a maximalist, magical winter night. The atmosphere should feel immersive, vibrant, and alive, serving as a dramatic stage for the fireworks.

## Key Components

### 1. Aurora Sky (`AuroraSky.tsx`)

- **Implementation**: A large sphere with a custom `ShaderMaterial`.
- **Shader Mechanics**:
  - **Vertex Shader**: Standard projection.
  - **Fragment Shader**: Uses Simplex Noise (`snoise`) to generate scrolling, curtain-like patterns.
  - **Colors**: Deep purple (`#38003b`), Bright Cyan (`#00b7ff`), and Magenta (`#ff0080`).
  - **Animation**: Driven by `uTime` uniform for slow, majestic movement.
- **Blending**: Additive blending to glow against the background.

### 2. Volumetric Fog

- **Color**: Deep Midnight Purple (`#0b0026`).
- **Density**: Tuned to obscure the horizon and blend the ground plane into the sky, creating a sense of depth and scale.
- **Effect**: Simulates a cold, dense winter atmosphere.

### 3. Lighting Strategy

- **Ambient**: Cool, low-intensity purple/blue to unify shadows.
- **Moonlight**: Strong, cool cyan spotlight to create rim lighting on the voxel models (houses, trees), ensuring they pop against the rich background.
- **Bloom**: Aggressive post-processing bloom (`intensity: 1.5`, `threshold: 0.8`) to make the aurora and stars glow.

### 4. Stars

- **Count**: High density (~8000).
- **Behavior**: Fast, variable fading/twinkling to add high-frequency noise and energy to the calmer aurora background.
