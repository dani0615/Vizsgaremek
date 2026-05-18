import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const PulseShape = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { mouse } = useThree();

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Rotation based on time
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;

            // Reaction to mouse
            meshRef.current.rotation.x += (mouse.y * 0.5 - meshRef.current.rotation.x) * 0.1;
            meshRef.current.rotation.y += (mouse.x * 0.5 - meshRef.current.rotation.y) * 0.1;
            
            // Pulsing scale
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            meshRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <MeshDistortMaterial
                    color={hovered ? "#00f3ff" : "#bc13fe"}
                    speed={2}
                    distort={0.4}
                    radius={1}
                    emissive={hovered ? "#00f3ff" : "#bc13fe"}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#bc13fe" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />
                <PulseShape />
            </Canvas>
        </div>
    );
};

export default Hero3D;
