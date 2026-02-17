
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars(props: any) {
    const ref = useRef<any>();
    const [sphere] = useState(() => {
        const data = random.inSphere(new Float32Array(5000), { radius: 1.5 });
        // Validate and fix any NaN values
        for (let i = 0; i < data.length; i++) {
            if (isNaN(data[i])) data[i] = 0;
        }
        return data;
    });

    useFrame((state: any, delta: number) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0 z-[1] w-full h-full">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
}
