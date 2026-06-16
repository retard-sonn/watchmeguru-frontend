"use client";

import { useEffect, useState, useRef } from "react";
import { Player } from "@lordicon/react";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: any;
  fallbackIcon?: any;
  size?: number;
  color?: string;
  trigger?: "hover" | "in-view" | "loop";
  className?: string;
}

export default function AnimatedIcon({ icon, fallbackIcon, size = 32, color = "#0D3319", trigger = "in-view", className = "" }: AnimatedIconProps) {
  const playerRef = useRef<Player>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (trigger === "in-view" && containerRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isHovered) {
            playerRef.current?.playFromBeginning();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else if (trigger === "loop") {
        playerRef.current?.play();
    }
  }, [trigger, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playerRef.current?.playFromBeginning();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      ref={containerRef} 
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Object.keys(icon).length > 0 ? (
      <Player 
        ref={playerRef} 
        icon={icon} 
        size={size} 
        colorize={color}
      />
      ) : fallbackIcon ? (
        (() => { const Fallback = fallbackIcon; return <Fallback size={size} color={color} />; })()
      ) : null}
    </div>
  );
}