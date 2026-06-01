"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import type * as THREE from "three";

// Country markers as glowing dots on the globe
const MARKERS = [
  { lat: 20, lng: 78, color: "#58CC02", label: "India", code: "IN" },
  { lat: 38, lng: -97, color: "#1CB0F6", label: "US", code: "US" },
  { lat: 54, lng: -2, color: "#CE82FF", label: "UK", code: "GB" },
  { lat: -25, lng: 135, color: "#D9A441", label: "AU", code: "AU" },
  { lat: 56, lng: -106, color: "#FF7A00", label: "CA", code: "CA" },
  { lat: 51, lng: 10, color: "#FF4B4B", label: "DE", code: "DE" },
  { lat: 36, lng: 138, color: "#78A6D8", label: "JP", code: "JP" },
  { lat: -15, lng: -50, color: "#94A84D", label: "BR", code: "BR" },
  { lat: 30, lng: 70, color: "#58CC02", label: "PK", code: "PK" },
  { lat: 9, lng: 8, color: "#D9A441", label: "NG", code: "NG" },
];

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function Globe({ onSelectCountry }: { onSelectCountry: (code: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const markersGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  const markerPositions = useMemo(() => {
    return MARKERS.map(m => ({
      ...m,
      position: latLngToVec3(m.lat, m.lng, 1.08),
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {/* Earth sphere */}
      <Sphere args={[1, 48, 48]}>
        <meshStandardMaterial color="#7BA65B" roughness={0.7} metalness={0.05} />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[1.06, 48, 48]}>
        <meshBasicMaterial color="#58CC02" transparent opacity={0.06} />
      </Sphere>

      {/* Country markers */}
      <group ref={markersGroup}>
        {markerPositions.map((m, i) => (
          <Float key={i} speed={2 + i * 0.3} floatIntensity={0.08}>
            <mesh
              position={m.position}
              onClick={(e) => { e.stopPropagation(); onSelectCountry(m.code); }}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color={m.color} emissive={m.color} emissiveIntensity={0.6} />
            </mesh>
            {/* Glow ring */}
            <mesh position={m.position}>
              <ringGeometry args={[0.04, 0.05, 32]} />
              <meshBasicMaterial color={m.color} transparent opacity={0.3} side={2} />
            </mesh>
          </Float>
        ))}
      </group>
    </group>
  );
}

interface GlobeSceneProps {
  onSelectCountry: (code: string) => void;
  className?: string;
}

export default function GlobeScene({ onSelectCountry, className = "" }: GlobeSceneProps) {
  return (
    <div className={`relative ${className}`} style={{ height: 320 }}>
      <Canvas camera={{ position: [0, 0.3, 2.5], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 3, 5]} intensity={0.8} color="#FFFFFF" />
        <pointLight position={[-3, -1, -2]} intensity={0.3} color="#58CC02" />
        <Globe onSelectCountry={onSelectCountry} />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-medium text-[#9B8E84]">Click a marker to select country</span>
      </div>
    </div>
  );
}

export { MARKERS };
