"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

/**
 * Animate element on scroll into view.
 * Usage: animateIn(ref, { y: 40, duration: 0.8 })
 */
export function animateIn(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 40, ...vars },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: target as Element,
        start: "top 85%",
        once: true,
      },
      ...vars,
    }
  );
}

/**
 * Stagger children animation on scroll.
 */
export function staggerIn(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: target as Element,
        start: "top 85%",
        once: true,
      },
      ...vars,
    }
  );
}

/**
 * Counter animation — animates a number from 0 to target.
 */
export function countUp(
  target: Element,
  endValue: number,
  duration: number = 2
) {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      (target as HTMLElement).textContent = Math.round(obj.value).toString();
    },
  });
}

/**
 * Pulse animation — attention grabber.
 */
export function pulse(target: gsap.TweenTarget) {
  return gsap.to(target, {
    scale: 1.05,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
}

export { gsap, ScrollTrigger };
