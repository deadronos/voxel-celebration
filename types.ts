import * as THREE from 'three';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  life: number; // 0 to 1
  decay: number;
}

export interface RocketData {
  id: string;
  position: THREE.Vector3;
  color: string;
  targetHeight: number;
}

export interface ExplosionEvent {
  position: THREE.Vector3;
  color: string;
  count: number;
}