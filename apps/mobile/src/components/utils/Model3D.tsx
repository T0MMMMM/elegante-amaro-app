import { Center, useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import * as THREE from "three";


export default function Model3D({ model }: { model: any }) {
    const { scene } = useGLTF(model.link) as any;
    const groupRef = useRef<any>(null);

    useFrame((state) => {
        if (groupRef.current) {
            
            const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;

            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.05);
        }
    });

    return (
        <group ref={groupRef} position={model.position}>
            <Center position={model.relativePosition} rotation={model.rotation}>
                <primitive object={scene} scale={model.scale} />
            </Center>
        </group>
    );
}