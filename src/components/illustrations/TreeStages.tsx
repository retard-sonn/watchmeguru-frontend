"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

// 6 custom growth stage illustrations — unified brand visual language
// Each stage is a unique SVG, not an emoji

function useAnimate() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" });
      gsap.to(ref.current, { y: -4, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

// Stage 1: Seed — small pot with a tiny sprout
export function SeedStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="68" rx="16" ry="4" fill="rgba(0,0,0,0.06)"/>
      <rect x="26" y="50" width="28" height="18" rx="3" fill="#D9A441" opacity="0.3" stroke="#C08A2E" strokeWidth="1.5"/>
      <rect x="30" y="54" width="20" height="10" rx="2" fill="#C08A2E" opacity="0.2"/>
      <path d="M32,50 Q40,40 48,50" fill="#7BA65B" opacity="0.4"/>
      <line x1="40" y1="48" x2="40" y2="44" stroke="#7BA65B" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="38" cy="43" rx="4" ry="5" fill="#7BA65B" opacity="0.6"/>
      <ellipse cx="43" cy="44" rx="3.5" ry="4.5" fill="#58CC02" opacity="0.5"/>
    </svg>
  );
}

// Stage 2: Sprout — small plant with two leaves
export function SproutStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="68" rx="16" ry="4" fill="rgba(0,0,0,0.06)"/>
      <rect x="28" y="52" width="24" height="16" rx="3" fill="#D9A441" opacity="0.3" stroke="#C08A2E" strokeWidth="1.5"/>
      <path d="M38,52 Q36,32 40,30" stroke="#7BA65B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M40,30 Q44,36 46,42" stroke="#7BA65B" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="35" cy="32" rx="8" ry="5" fill="#58CC02" opacity="0.7" transform="rotate(-30,35,32)"/>
      <ellipse cx="46" cy="38" rx="7" ry="4.5" fill="#7BA65B" opacity="0.6" transform="rotate(20,46,38)"/>
      <circle cx="40" cy="30" r="2.5" fill="#94A84D" opacity="0.5"/>
    </svg>
  );
}

// Stage 3: Sapling — larger plant with multiple leaves and a small trunk
export function SaplingStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="70" rx="18" ry="4" fill="rgba(0,0,0,0.06)"/>
      <rect x="30" y="56" width="20" height="14" rx="3" fill="#D9A441" opacity="0.3" stroke="#C08A2E" strokeWidth="1.5"/>
      <path d="M38,56 L40,25" stroke="#5B4636" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40,25 Q34,26 32,30" stroke="#5B4636" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="30" cy="28" rx="10" ry="6" fill="#58CC02" opacity="0.7" transform="rotate(-40,30,28)"/>
      <ellipse cx="45" cy="32" rx="9" ry="5.5" fill="#7BA65B" opacity="0.7" transform="rotate(25,45,32)"/>
      <ellipse cx="36" cy="22" rx="8" ry="5" fill="#94A84D" opacity="0.6" transform="rotate(-10,36,22)"/>
      <circle cx="34" cy="25" r="1.5" fill="#58CC02" opacity="0.4"/>
      <circle cx="44" cy="30" r="1.5" fill="#7BA65B" opacity="0.3"/>
    </svg>
  );
}

// Stage 4: Tree — proper tree with canopy
export function TreeStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="72" rx="16" ry="3.5" fill="rgba(0,0,0,0.06)"/>
      <path d="M36,58 L40,18" stroke="#5B4636" strokeWidth="4" strokeLinecap="round"/>
      <path d="M38,35 L28,38" stroke="#5B4636" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M42,32 L52,36" stroke="#5B4636" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="22" rx="16" ry="14" fill="#58CC02" opacity="0.6"/>
      <ellipse cx="32" cy="28" rx="12" ry="10" fill="#7BA65B" opacity="0.5" transform="rotate(-20,32,28)"/>
      <ellipse cx="48" cy="26" rx="11" ry="9" fill="#94A84D" opacity="0.4" transform="rotate(15,48,26)"/>
      <ellipse cx="40" cy="16" rx="9" ry="7" fill="#58CC02" opacity="0.4"/>
      <circle cx="36" cy="20" r="1.5" fill="#FFC800" opacity="0.3"/>
      <circle cx="46" cy="24" r="1.5" fill="#FFC800" opacity="0.25"/>
    </svg>
  );
}

// Stage 5: Forest — large tree with dense canopy, birds
export function ForestStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="74" rx="20" ry="4" fill="rgba(0,0,0,0.06)"/>
      <path d="M36,62 L40,14" stroke="#3D2E24" strokeWidth="5" strokeLinecap="round"/>
      <path d="M37,30 L24,34" stroke="#3D2E24" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M43,26 L56,30" stroke="#3D2E24" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="18" rx="20" ry="16" fill="#7BA65B" opacity="0.5"/>
      <ellipse cx="33" cy="24" rx="14" ry="12" fill="#58CC02" opacity="0.5" transform="rotate(-15,33,24)"/>
      <ellipse cx="50" cy="22" rx="13" ry="10" fill="#94A84D" opacity="0.4" transform="rotate(20,50,22)"/>
      <ellipse cx="40" cy="12" rx="11" ry="8" fill="#58CC02" opacity="0.35"/>
      <path d="M58,14 Q62,10 66,14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none"/>
      <path d="M62,10 Q66,6 70,10" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none"/>
      <circle cx="36" cy="16" r="2" fill="#FFC800" opacity="0.35"/>
      <circle cx="46" cy="20" r="2" fill="#D9A441" opacity="0.3"/>
    </svg>
  );
}

// Stage 6: World Tree — massive ancient tree with full ecosystem
export function WorldTreeStage({ size = 80 }: { size?: number }) {
  const ref = useAnimate();
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="74" rx="22" ry="4.5" fill="rgba(0,0,0,0.06)"/>
      {/* Trunk */}
      <path d="M34,64 L40,8" stroke="#3D2E24" strokeWidth="6" strokeLinecap="round"/>
      <path d="M36,28 L22,34" stroke="#3D2E24" strokeWidth="3" strokeLinecap="round"/>
      <path d="M44,24 L58,28" stroke="#3D2E24" strokeWidth="3" strokeLinecap="round"/>
      {/* Canopy layers */}
      <ellipse cx="40" cy="14" rx="22" ry="16" fill="#7BA65B" opacity="0.45"/>
      <ellipse cx="32" cy="20" rx="16" ry="12" fill="#58CC02" opacity="0.45" transform="rotate(-12,32,20)"/>
      <ellipse cx="52" cy="18" rx="15" ry="11" fill="#94A84D" opacity="0.4" transform="rotate(18,52,18)"/>
      <ellipse cx="40" cy="8" rx="13" ry="9" fill="#58CC02" opacity="0.3"/>
      {/* Crown glow */}
      <circle cx="40" cy="12" r="20" fill="#FFC800" opacity="0.06"/>
      <circle cx="40" cy="12" r="14" fill="#FFC800" opacity="0.08"/>
      {/* Birds */}
      <path d="M60,8 Q63,4 66,8" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" fill="none"/>
      <path d="M66,4 Q69,0 72,4" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none"/>
      <path d="M56,14 Q59,10 62,14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none"/>
      {/* Fruit/stars */}
      <circle cx="34" cy="12" r="2.5" fill="#D9A441" opacity="0.5"/>
      <circle cx="48" cy="16" r="2.5" fill="#FFC800" opacity="0.4"/>
      <circle cx="30" cy="22" r="2" fill="#D9A441" opacity="0.4"/>
      <circle cx="52" cy="22" r="2" fill="#CE82FF" opacity="0.35"/>
      {/* Root system */}
      <path d="M40,68 Q32,72 28,76" stroke="#3D2E24" strokeWidth="2" strokeLinecap="round"/>
      <path d="M40,68 Q48,72 52,76" stroke="#3D2E24" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Export as a map for easy lookup
export const TREE_STAGES = {
  seed: SeedStage,
  sprout: SproutStage,
  sapling: SaplingStage,
  tree: TreeStage,
  forest: ForestStage,
  worldTree: WorldTreeStage,
} as const;

export const STAGE_KEYS = ["seed", "sprout", "sapling", "tree", "forest", "worldTree"] as const;
export type StageKey = typeof STAGE_KEYS[number];
