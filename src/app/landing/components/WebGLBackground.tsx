"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Preload, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function GlowingNode({ position, color, scale = 1, delay = 0 }: { position: [number, number, number], color: string, scale?: number, delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();
   
    const pulse = Math.sin(time * 2 + delay) * 0.15 + 0.85;
    meshRef.current.scale.setScalar(scale * pulse);
    materialRef.current.opacity = pulse * 0.6;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial ref={materialRef} color={color} transparent wireframe opacity={0.6} />
      </mesh>
    </Float>
  );
}

function DataWires() {
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#2E7A0A", transparent: true, opacity: 0.15 }), []);
  
  const points = useMemo(() => {
    const pts = [];
   
    for (let i = 0; i < 40; i++) {
      pts.push(
        new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 10 - 15)
      );
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return <lineSegments geometry={geometry} material={lineMaterial} />;
}

function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
   
    gsap.to(camera.position, {
      x: pointer.x * 2,
      y: pointer.y * 2,
      duration: 1.5,
      ease: "power2.out",
    });
    camera.lookAt(0, 0, -10);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />;
}

export default function WebGLBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }}>
      <Canvas dpr={[1, 2]}>
        <CameraRig />
        <fog attach="fog" args={["#F8FAF5", 10, 40]} />
        <ambientLight intensity={0.5} />

        <GlowingNode position={[-8, 4, -10]} color="#58CC02" scale={1.2} delay={0} />
        <GlowingNode position={[10, -5, -15]} color="#F5A623" scale={1.8} delay={1} />
        <GlowingNode position={[-12, -6, -20]} color="#3B82F6" scale={2.5} delay={2} />
        <GlowingNode position={[6, 8, -12]} color="#EF4444" scale={0.8} delay={3} />
        <GlowingNode position={[0, -2, -8]} color="#1A3A0A" scale={0.5} delay={1.5} />

        <DataWires />

        <Preload all />
      </Canvas>
    </div>
  );
}