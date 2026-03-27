import { describe, expect, it } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import type { Mesh } from "three";

import SceneInteraction from "@/components/SceneInteraction";

describe("SceneInteraction", () => {
  it("renders a raycastable ground plane at the scene floor", async () => {
    const renderer = await ReactThreeTestRenderer.create(<SceneInteraction onShoot={() => {}} />);

    const meshNode = renderer.scene.find((node) => {
      const instance = node.instance as Mesh | null | undefined;
      return !!instance && instance.isMesh;
    });

    const mesh = meshNode.instance as Mesh;

    expect(mesh.visible).not.toBe(false);
    expect(mesh.position.y).toBe(-2);
    expect(mesh.rotation.x).toBeCloseTo(-Math.PI / 2);

    await renderer.unmount();
  });
});
