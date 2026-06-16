"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MascotOwlProps {
  className?: string;
  state?: "idle" | "eye-track" | "celebrate";
}

export default function MascotOwl({ className = "", state = "eye-track" }: MascotOwlProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bodyRef = useRef<SVGGElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const leftWingRef = useRef<SVGPathElement>(null);
  const rightWingRef = useRef<SVGPathElement>(null);
  const leftEyelidRef = useRef<SVGPathElement>(null);
  const rightEyelidRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
    idleTl.to(bodyRef.current, {
      scaleY: 1.03,
      scaleX: 1.01,
      duration: 1.5,
      ease: "sine.inOut",
      transformOrigin: "bottom center",
    });

    const blinkTl = gsap.timeline({ repeat: -1 });
    blinkTl
      .to([leftEyelidRef.current, rightEyelidRef.current], {
        scaleY: 1,
        duration: 0.1,
        ease: "power1.in",
      }, "+=3")
      .to([leftEyelidRef.current, rightEyelidRef.current], {
        scaleY: 0,
        duration: 0.1,
        ease: "power1.out",
      })
      .to([leftEyelidRef.current, rightEyelidRef.current], {
        scaleY: 1,
        duration: 0.1,
        ease: "power1.in",
      }, "+=0.2")
      .to([leftEyelidRef.current, rightEyelidRef.current], {
        scaleY: 0,
        duration: 0.1,
        ease: "power1.out",
      });

    if (state === "eye-track") {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        const maxMoveX = 5;
        const maxMoveY = 6;
        
        const moveX = Math.max(-maxMoveX, Math.min(maxMoveX, distanceX * 0.02));
        const moveY = Math.max(-maxMoveY, Math.min(maxMoveY, distanceY * 0.02));

        gsap.to([leftPupilRef.current, rightPupilRef.current], {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

    if (state === "celebrate") {
      const celebrateTl = gsap.timeline({ repeat: -1 });
      celebrateTl.to(bodyRef.current, { y: -20, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" })
                 .to(leftWingRef.current, { rotation: -30, transformOrigin: "right top", duration: 0.2, yoyo: true, repeat: 3 }, 0)
                 .to(rightWingRef.current, { rotation: 30, transformOrigin: "left top", duration: 0.2, yoyo: true, repeat: 3 }, 0);
    }

  }, { dependencies: [state], scope: containerRef });

  return (
    <div ref={containerRef} className={`relative w-48 h-48 mx-auto ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl overflow-visible">
        <g ref={bodyRef}>
          
          <path d="M70 170 C70 175 80 180 85 180 C90 180 90 170 90 170 Z" fill="#F59E0B" />
          <path d="M130 170 C130 175 120 180 115 180 C110 180 110 170 110 170 Z" fill="#F59E0B" />

          <rect x="40" y="50" width="120" height="120" rx="60" fill="#22C55E" />

          <rect x="55" y="100" width="90" height="60" rx="30" fill="#BBF7D0" />
          <path d="M70 120 Q80 110 90 120" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M110 120 Q120 110 130 120" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M90 140 Q100 130 110 140" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" fill="none"/>

          <path ref={leftWingRef} d="M45 100 C30 100 25 130 40 140 C50 145 45 110 45 100 Z" fill="#16A34A" />
          <path ref={rightWingRef} d="M155 100 C170 100 175 130 160 140 C150 145 155 110 155 100 Z" fill="#16A34A" />

          <circle ref={leftEyeRef} cx="75" cy="80" r="22" fill="white" />
          <circle ref={rightEyeRef} cx="125" cy="80" r="22" fill="white" />

          <circle ref={leftPupilRef} cx="75" cy="80" r="8" fill="#1E293B" />
          <circle ref={rightPupilRef} cx="125" cy="80" r="8" fill="#1E293B" />

          <path d="M90 95 L110 95 L100 115 Z" fill="#F59E0B" />

          <path ref={leftEyelidRef} d="M53 80 A 22 22 0 0 1 97 80 L53 80 Z" fill="#16A34A" transform="scale(1, 0)" transform-origin="75 80" />
          <path ref={rightEyelidRef} d="M103 80 A 22 22 0 0 1 147 80 L103 80 Z" fill="#16A34A" transform="scale(1, 0)" transform-origin="125 80" />
        </g>
      </svg>
    </div>
  );
}
