import Model3D from '@/src/components/utils/Model3D';
import { Ionicons } from '@expo/vector-icons';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import React, { Suspense, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from "../constants/theme";
import useFonts from "../hooks/useFonts";

const models = [
  {
    name: "Frappuccino Latte",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    link: require("@/src/public/models/coffee.glb"),
    scale: 1.6,
    rotation: [0, 0, -Math.PI / 16],
    position: [0, 10, 0],
    relativePosition: [0, -1, 0],
  },
  {
    name: "Thunderlight Logo",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    link: require("@/src/public/models/logo-icon.glb"),
    scale: 1.8,
    rotation: [0, 0, -Math.PI / 24],
    position: [0, 10, 0],
    relativePosition: [0, -1, 0],
  },
]

models.forEach(model => {
  useGLTF.preload(model.link);
});

export default function Page() {

  const [currentModel, setCurrentModel] = useState(0);

  const fontsLoaded = useFonts();

  if (!fontsLoaded) return null;

  const handleNext = () => {
    setCurrentModel((prev) => (prev + 1) % models.length);

  };

  const handlePrev = () => {
    setCurrentModel((prev) => (prev - 1 + models.length) % models.length);
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Elegante Amaro</Text>
      </View>

      <View style={styles.modelContainer}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} />

          <ambientLight intensity={1.5} color={'white'}/>

          <directionalLight position={[-5, 0, 5]} intensity={2.5} color={'white'}/>

          <ContactShadows
            position={[0, -2.7, 0]}
            opacity={0.2}
            scale={3}
            blur={4}
            far={4}
          />

          <Suspense fallback={null}>
            <Model3D key={currentModel} model={models[currentModel]} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={8}
            autoRotate={true}
            autoRotateSpeed={3}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>

        <TouchableOpacity
          style={[styles.arrowButton, { left: 20 }]}
          onPress={() => handlePrev()}
        >
          <Ionicons name="chevron-back" size={30} color={theme.colors.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrowButton, { right: 20 }]}
          onPress={() => handleNext()}
        >
          <Ionicons name="chevron-forward" size={30} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.mainText}>{models[currentModel].name}</Text>

      <Text style={styles.description}>{models[currentModel].description}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  modelContainer: {
    width: '100%',
    height: '70%',
  },
  description: {
    fontSize: 14,
    fontFamily: theme.fonts.secondary,
    color: theme.colors.secondary,
    textAlign: 'left',
    paddingTop: 50,
    paddingLeft: 20,
  },
  mainText: {
    fontSize: 35,
    fontFamily: theme.fonts.third,
    color: theme.colors.onPrimary,
    paddingLeft: 20,
  },
  mainTitle: {
    fontSize: 55,
    fontFamily: theme.fonts.title2,
    color: theme.colors.onPrimary,
    paddingHorizontal: 10,
  },
  arrowButton: {
    position: 'absolute',
    top: '70%',
    marginTop: -20,
    zIndex: 100,
  },
});