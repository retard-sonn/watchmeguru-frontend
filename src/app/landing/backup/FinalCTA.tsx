"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Ornament from "@/components/illustrations/Ornament";

export default function FinalCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(165deg, #0D3319 0%, #1A3A0A 50%, #081F0E 100%)" }}>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[60%] rounded-full"
          style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(88,204,2,0.18) 0%, transparent 65%)" }}
        />
        <div className="absolute top-[50%] left-[-5%] rounded-full"
          style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(120,166,216,0.12) 0%, transparent 65%)" }}
        />
        <div className="absolute top-[70%] left-[55%] rounded-full"
          style={{ width: 350, height: 350, background: "radial-gradient(circle, rgba(123,166,91,0.12) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          
          <div className="flex justify-center mb-10">
            <motion.svg viewBox="0 0 300 180" className="w-72 h-auto" fill="none"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              
              <ellipse cx="150" cy="150" rx="140" ry="16" fill="rgba(255,255,255,0.04)" />
              <polygon points="150,120 260,140 150,160 40,140" fill="#FF9E1B" opacity="0.4" />
              <polygon points="40,140 150,120 150,160" fill="#5F8C3E" opacity="0.4" />
              <polygon points="150,120 260,140 150,160" fill="#94A84D" opacity="0.3" />
              
              <rect x="98" y="118" width="4" height="14" rx="1" fill="#0D3319" opacity="0.6" />
              <ellipse cx="100" cy="112" rx="12" ry="16" fill="#FF9E1B" opacity="0.5" />
              <ellipse cx="100" cy="106" rx="8" ry="12" fill="#94A84D" opacity="0.5" />
              <rect x="198" y="122" width="4" height="14" rx="1" fill="#0D3319" opacity="0.6" />
              <ellipse cx="200" cy="116" rx="12" ry="16" fill="#FF9E1B" opacity="0.5" />
              <ellipse cx="200" cy="110" rx="8" ry="12" fill="#94A84D" opacity="0.5" />
              
              <rect x="125" y="128" width="40" height="24" rx="4" fill="#0D3319" opacity="0.4" />
              <rect x="185" y="126" width="30" height="26" rx="4" fill="#7A6554" opacity="0.4" />
              
              <circle cx="80" cy="40" r="18" fill="#58CC02" opacity="0.35" />
              <circle cx="80" cy="40" r="12" fill="#E8C65A" opacity="0.5" />
              
              <path d="M220,30 Q224,26 228,30" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M235,24 Q239,20 243,24" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
              <path d="M210,36 Q214,32 218,36" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
            </motion.svg>
          </div>

          <h2
            className="font-extrabold leading-[1.08] tracking-tight mb-8"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(34px, 5vw, 56px)",
              color: "#F0FDF4",
            }}
          >
            Your future is built
            <br />
            one consistent day
            <br />
            <span className="text-mustard-shimmer">at a time.</span>
          </h2>

          <p
            className="text-[16px] mb-12 max-w-md mx-auto font-medium"
            style={{ color: "rgba(253,249,240,0.55)" }}
          >
            Set up your study companion in 3 minutes. Get your first check-in today.
            Your study ecosystem is waiting.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link href="/sign-up" className="btn-mustard text-[18px] py-5 px-14">
              Start Building Your World →
            </Link>
            <div className="flex items-center gap-4">
              <Ornament variant="dots" />
              <span className="text-[13px] font-medium" style={{ color: "rgba(253,249,240,0.3)" }}>
                Free to start · No credit card
              </span>
              <Ornament variant="dots" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
