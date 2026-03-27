import * as THREE from 'three';
import { RocketData } from '../types';

type Listener = (rockets: RocketData[]) => void;

class RocketStore {
  private rockets: RocketData[] = [];
  private listeners: Set<Listener> = new Set();

  getRockets(): RocketData[] {
    return this.rockets;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Emit initial value
    listener(this.rockets);
    return () => this.listeners.delete(listener);
  }

  addRocket(position: THREE.Vector3, color: string) {
    const id = Math.random().toString(36).substr(2, 9);
    const targetHeight = 8 + Math.random() * 7;

    this.rockets = [...this.rockets, { id, position, color, targetHeight }];
    this.notify();
  }

  removeRocket(id: string) {
    this.rockets = this.rockets.filter((r) => r.id !== id);
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l(this.rockets));
  }
}

export const rocketStore = new RocketStore();
