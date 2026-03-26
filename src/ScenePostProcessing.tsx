import { Bloom, EffectComposer } from '@react-three/postprocessing';

export default function ScenePostProcessing() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.8} radius={0.5} />
    </EffectComposer>
  );
}
