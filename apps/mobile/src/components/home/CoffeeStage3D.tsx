import Model3D from '@/src/components/utils/Model3D';
import { COFFEE_MODEL } from '@/src/data/items.mock';
import {
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import { Suspense } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// Préchargement du modèle par défaut.
useGLTF.preload(COFFEE_MODEL);

interface Props {
  /** Modèle .glb à afficher (require). */
  modelSource?: number;
  style?: ViewStyle;
}

/** Scène 3D : café qui tourne (auto-rotate + flottement) sur fond crème. */
export default function CoffeeStage3D({ modelSource, style }: Props) {
  const source = modelSource ?? COFFEE_MODEL;
  const model = {
    link: source,
    scale: 1.6,
    rotation: [0, 0, -Math.PI / 16],
    position: [0, 10, 0],
    relativePosition: [0, -1, 0],
  };

  return (
    <View style={[styles.stage, style]}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <ambientLight intensity={1.5} color="white" />
        <directionalLight position={[-5, 0, 5]} intensity={2.5} color="white" />
        <ContactShadows position={[0, -2.7, 0]} opacity={0.2} scale={3} blur={4} far={4} />
        <Suspense fallback={null}>
          <Model3D key={source} model={model} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={8}
          autoRotate
          autoRotateSpeed={3}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    flex: 1,
  },
});
