"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import type * as THREE from "three";

interface GrowthWorldProps {
  level: number;      // 1-30
  streak: number;     // current streak
  tasksCompleted: number;
  className?: string;
}

// A 3D tree that grows based on user progress
function Tree({ stage }: { stage: number }) {
  const trunkRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Group>(null);

  // Stage 0-5 maps to Seed→World Tree
  const trunkHeight = 0.5 + stage * 0.4;
  const trunkRadius = 0.08 + stage * 0.02;
  const leafCount = 3 + stage * 4;
  const leafSize = 0.15 + stage * 0.08;
  const leafSpread = 0.3 + stage * 0.15;

  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const radius = leafSpread * (0.4 + Math.random() * 0.6);
      const y = trunkHeight * 0.6 + i * (0.3 / leafCount);
      arr.push({ angle, radius, y, size: leafSize * (0.7 + Math.random() * 0.6) });
    }
    return arr;
  }, [stage, trunkHeight, leafCount, leafSize, leafSpread]);

  useFrame((state) => {
    if (trunkRef.current) {
      trunkRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (leavesRef.current) {
      leavesRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Trunk */}
      <Float speed={0.5} floatIntensity={0.1}>
        <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]}>
          <cylinderGeometry args={[trunkRadius, trunkRadius * 1.3, trunkHeight, 8]} />
          <meshStandardMaterial color="#5B4636" roughness={0.8} />
        </mesh>
      </Float>

      {/* Leaves */}
      <group ref={leavesRef}>
        {leaves.map((leaf, i) => (
          <Float key={i} speed={0.8 + i * 0.1} floatIntensity={0.08}>
            <Sphere position={[Math.cos(leaf.angle) * leaf.radius, leaf.y, Math.sin(leaf.angle) * leaf.radius]} args={[leaf.size, 8, 6]}>
              <MeshDistortMaterial color={i % 3 === 0 ? "#58CC02" : i % 3 === 1 ? "#7BA65B" : "#94A84D"} roughness={0.6} distort={0.15} speed={1 + i * 0.2} />
            </Sphere>
          </Float>
        ))}
      </group>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#EBE3C8" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Floating achievement orbs
function AchievementOrbs({ count, total }: { count: number; total: number }) {
  const orbs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < total; i++) {
      const angle = (i / total) * Math.PI * 2;
      const unlocked = i < count;
      arr.push({ angle, unlocked, size: unlocked ? 0.06 : 0.04 });
    }
    return arr;
  }, [count, total]);

  return (
    <group position={[0, 1.5, 0]}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.15}>
          <mesh position={[Math.cos(orb.angle) * 0.8, Math.sin(i * 0.5) * 0.1, Math.sin(orb.angle) * 0.8]}>
            <sphereGeometry args={[orb.size, 8, 8]} />
            <meshStandardMaterial color={orb.unlocked ? "#FFC800" : "#9B8E84"} emissive={orb.unlocked ? "#FFC800" : "transparent"} emissiveIntensity={orb.unlocked ? 0.4 : 0} roughness={0.3} metalness={0.1} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function GrowthWorld({ level, streak, tasksCompleted, className = "" }: GrowthWorldProps) {
  const stage = Math.min(5, Math.floor(level / 4));
  const achievementCount = Math.min(10, tasksCompleted);

  return (
    <div className={`relative rounded-3xl overflow-hidden ${className}`} style={{ height: 300, background: "linear-gradient(180deg, #EBE3C8 0%, #F4EEDB 60%, #FDFDFC 100%)", border: "1.5px solid rgba(123,166,91,0.08)", boxShadow: "inset 0 0 60px rgba(123,166,91,0.03)" }}>
      <Canvas camera={{ position: [0, 1.2, 2.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 3, 2]} intensity={0.6} color="#FFC800" />
        <pointLight position={[-2, 1, -1]} intensity={0.3} color="#58CC02" />
        <directionalLight position={[0, 5, 3]} intensity={0.5} color="#FFFFFF" />
        <Tree stage={stage} />
        <AchievementOrbs count={achievementCount} total={10} />
      </Canvas>
      {/* Overlay text */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#9B8E84]">3D Growth World</span>
        <span className="text-[11px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>
          Stage {stage + 1}/6
        </span>
      </div>
    </div>
  );
}
