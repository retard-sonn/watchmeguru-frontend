"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GrowthWorldProps {
  level: number;
  streak: number;
  tasksCompleted: number;
  className?: string;
}

// ─── STYLIZED MATERIALS ──────────────────────────────────────────

const TOON_COLORS = {
  trunk: "#5B4636",
  leafPrimary: "#58CC02",
  leafSecondary: "#7BA65B",
  leafTertiary: "#94A84D",
  pot: "#FDFDFC",
  glow: "#FFC800"
};

// ─── 3D COMPONENTS ───────────────────────────────────────────────

function KnowledgeLeaves({ count, stage }: { count: number; stage: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const leaves = useMemo(() => {
    const arr = [];
    const baseCount = 5 + stage * 5;
    for (let i = 0; i < baseCount; i++) {
      const angle = (i / baseCount) * Math.PI * 2;
      const radius = 0.3 + stage * 0.12;
      const y = 0.4 + stage * 0.2 + (Math.random() * 0.2);
      arr.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        scale: 0.1 + Math.random() * 0.15,
        color: i % 3 === 0 ? TOON_COLORS.leafPrimary : i % 3 === 1 ? TOON_COLORS.leafSecondary : TOON_COLORS.leafTertiary,
        speed: 1 + Math.random()
      });
    }
    return arr;
  }, [stage]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, i) => (
        <Float key={i} speed={leaf.speed} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={leaf.position} scale={leaf.scale}>
            <sphereGeometry args={[1, 12, 12]} />
            <MeshDistortMaterial 
              color={leaf.color} 
              distort={0.4} 
              speed={2} 
              roughness={0} 
              metalness={0}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SeedPod({ index }: { index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const angle = (index * 1.2);
  const radius = 0.6 + (index * 0.03);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  useGSAP(() => {
    if (!meshRef.current) return;
    gsap.fromTo(meshRef.current.scale, 
      { x: 0, y: 0, z: 0 }, 
      { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1, 0.4)", delay: index * 0.15 }
    );
  }, []);

  return (
    <group ref={meshRef} position={[x, -0.25, z]}>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.4}>
        {/* The "Seed" - Tapered teardrop shape */}
        <mesh castShadow>
          <coneGeometry args={[0.045, 0.12, 12]} />
          <meshToonMaterial color="#734F26" />
        </mesh>
        {/* Outer shell detail */}
        <mesh position={[0, -0.02, 0]} scale={[1.1, 0.6, 1.1]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshToonMaterial color="#5B4636" />
        </mesh>
        {/* Tiny sprout tip */}
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshToonMaterial color="#A3E635" />
        </mesh>
      </Float>
    </group>
  );
}

function GuruTree({ stage, level, tasksCompleted }: { stage: number, level: number, tasksCompleted: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Growth scale factors
  const trunkScale = 0.4 + stage * 0.3;
  const treeY = -0.4;

  useGSAP(() => {
    if (!meshRef.current) return;
    // satisfying growth/thump bounce
    gsap.fromTo(meshRef.current.scale, 
      { x: 0.8, y: 0.8, z: 0.8 }, 
      { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1.2, 0.5)" }
    );
  }, [level]);

  return (
    <group ref={meshRef} position={[0, treeY, 0]}>
      {/* Stylized Pot */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.22, 0.35, 16]} />
        <meshToonMaterial color={TOON_COLORS.pot} />
      </mesh>
      
      {/* Trunk */}
      <mesh position={[0, 0.5 * trunkScale + 0.25, 0]} scale={[1, trunkScale, 1]}>
        <cylinderGeometry args={[0.08, 0.12, 1, 12]} />
        <meshToonMaterial color={TOON_COLORS.trunk} />
      </mesh>

      {/* Leaves & Knowledge Orbs */}
      <KnowledgeLeaves count={level} stage={stage} />

      {/* Magic Glow at base */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color={TOON_COLORS.leafPrimary} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Render physical seeds around the base */}
      {Array.from({ length: Math.min(10, tasksCompleted) }).map((_, i) => (
        <SeedPod key={i} index={i} />
      ))}
    </group>
  );
}

function FloatingParticles() {
  const points = useMemo(() => {
    const p = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      p[i * 3] = (Math.random() - 0.5) * 4;
      p[i * 3 + 1] = Math.random() * 3;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={points.length / 3} 
          array={points} 
          itemSize={3}
          args={[points, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#FFC800" transparent opacity={0.6} />
    </points>
  );
}

// ─── MAIN WORLD ──────────────────────────────────────────────────

export default function GrowthWorld({ level, streak, tasksCompleted, className = "" }: GrowthWorldProps) {
  const stage = Math.min(5, Math.floor(level / 2)); // More stages for dopamine
  
  return (
    <div className={`relative rounded-[2.5rem] overflow-hidden group ${className}`} 
      style={{ 
        height: 400, 
        background: "linear-gradient(180deg, #FDF9F0 0%, #F4EEDB 100%)", 
        border: "2px solid rgba(123,166,91,0.15)",
        boxShadow: "0 20px 50px rgba(61,46,36,0.1)"
      }}>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,204,2,0.05)_0%,transparent_70%)]" />

      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0.8, 3.2]} fov={40} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#58CC02" />
        
        <GuruTree stage={stage} level={level} tasksCompleted={tasksCompleted} />
        <FloatingParticles />

        <ContactShadows 
          position={[0, -0.4, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={0.8} 
        />
        
        <Environment preset="studio" />
      </Canvas>

      {/* Interactive HUD */}
      <div className="absolute top-6 left-6 flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8E84]">Ecosystem Growth</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: TOON_COLORS.leafPrimary }} />
          <span className="text-[18px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
            Evolution Stage {stage + 1}
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <div className="px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border-2 border-[rgba(0,0,0,0.04)] shadow-sm flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#D9A441" }} />
          <span className="text-[12px] font-bold text-[#6B5D52]">
            {tasksCompleted} {tasksCompleted === 1 ? 'Seed' : 'Seeds'} Planted
          </span>
        </div>
      </div>
    </div>
  );
}
