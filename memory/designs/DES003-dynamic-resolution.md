# DES003: Dynamic Resolution Scaling

## Goal

Maintain a consistent 60 FPS frame rate on varying hardware by dynamically adjusting the rendering resolution (Device Pixel Ratio) in real-time.

## Key Components

### 1. `DynamicResScaler` Component (`DynamicResScaler.tsx`)

- **Role**: Performance monitor and controller.
- **Logic**:
  - **Monitoring**: Uses `useFrame` to track frame times over a 500ms interval.
  - **Decision Cycle**: Calculates average FPS.
    - If **FPS < 55**: Decrease DPR by 0.1 (Min: 0.5).
    - If **FPS > 65**: Increase DPR by 0.1 (Max: Device Native or 2.0).
  - **State Management**: Uses `useRef` to hold state (accumulated frames, time) to avoid React re-renders, directly modifying the Three.js renderer state via `setDpr`.

### 2. Integration Strategy

- **Placement**: Added as a child of the `Canvas` in `App.tsx`.
- **Scope**: Affects the entire WebGL context, scaling all geometry and shaders uniformly.
