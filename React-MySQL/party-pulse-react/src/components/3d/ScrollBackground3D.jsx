import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Shard = ({ position, color, size, speed, geometryType }) => {
    const meshRef = useRef();
    const zOffset = useRef(Math.random() * Math.PI * 2);
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * speed * 0.2;
        meshRef.current.rotation.y = time * speed * 0.3;
        
        // Depth float
        meshRef.current.position.z = position[2] + Math.sin(time * speed * 0.5 + zOffset.current) * 0.5;
        
        const scrollY = window.scrollY;
        meshRef.current.position.y = position[1] - (scrollY * 0.0015 * speed);
    });

    const Geometry = useMemo(() => {
        switch(geometryType) {
            case 0: return <icosahedronGeometry args={[size, 0]} />;
            case 1: return <torusGeometry args={[size, size/4, 8, 16]} />;
            case 2: return <octahedronGeometry args={[size, 0]} />;
            case 3: return <sphereGeometry args={[size, 16, 16]} />;
            case 4: return <cylinderGeometry args={[0.01, 0.01, size * 10]} />; // New "Beam"
            default: return <icosahedronGeometry args={[size, 0]} />;
        }
    }, [geometryType, size]);

    return (
        <mesh ref={meshRef} position={position} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            {Geometry}
            <meshStandardMaterial 
                color={color} 
                wireframe={geometryType !== 4} 
                transparent 
                opacity={geometryType === 4 ? 0.8 : 0.25}
                emissive={color}
                emissiveIntensity={geometryType === 4 ? 2 : 0.6}
            />
        </mesh>
    );
};

const ScrollBackground3D = () => {
    const shards = useMemo(() => {
        return Array.from({ length: 45 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 12
            ],
            color: Math.random() > 0.6 ? '#bc13fe' : (Math.random() > 0.5 ? '#00f3ff' : '#ff00de'),
            size: 0.15 + Math.random() * 0.45,
            speed: 0.4 + Math.random() * 1.8,
            geometryType: Math.floor(Math.random() * 5)
        }));
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2,
            pointerEvents: 'none'
        }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#bc13fe" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
                {shards.map((shard, i) => (
                    <Shard key={i} {...shard} />
                ))}
            </Canvas>
        </div>
    );
};

export default ScrollBackground3D;
