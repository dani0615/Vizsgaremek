import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleExplosion = () => {
    const pointsRef = useRef();
    
    const particles = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            // Start at center
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            
            // Random velocity in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = 0.05 + Math.random() * 0.1;
            
            velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            velocities[i * 3 + 2] = Math.cos(phi) * speed;
        }
        return { positions, velocities };
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        
        const pos = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < particles.positions.length; i++) {
            pos[i] += particles.velocities[i];
            // Slow down
            particles.velocities[i] *= 0.98;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={particles.positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#bc13fe"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const MatchCelebration3D = ({ onComplete }) => {
    // Auto-remove after some time
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(188,19,254,0.1) 0%, transparent 70%)'
        }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <ParticleExplosion />
            </Canvas>
        </div>
    );
};

export default MatchCelebration3D;
