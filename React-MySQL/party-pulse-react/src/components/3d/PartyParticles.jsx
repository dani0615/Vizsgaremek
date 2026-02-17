import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const PartyBackground = ({ containerStyle = {}, count = 5000, color = "#bc13fe" }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            ...containerStyle
        }}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars color={color} count={count} />
            </Canvas>
        </div>
    );
};

// Update Stars to use props
const Stars = ({ color, count, ...props }) => {
    const ref = useRef();
    const [sphere] = useMemo(() => random.inSphere(new Float32Array(count), { radius: 1.5 }), [count]);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

export default PartyBackground;
