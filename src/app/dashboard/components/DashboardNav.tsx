"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import GuruMascot from "@/components/illustrations/GuruMascot";
import { Lock, Phone, Trophy, LayoutDashboard } from "lucide-react";
import gsap from "gsap";

interface Props {
  onSetup: () => void;
  onUnlock: () => void;
  onOpenLeaderboard: () => void;
  hasSetup: boolean;
  scheduleLocked: boolean;
  hasWhatsapp: boolean;
  hasDiscord: boolean;
  hasTelegram: boolean;
}

export default function DashboardNav({ onSetup, onUnlock, onOpenLeaderboard, hasSetup, scheduleLocked, hasWhatsapp, hasDiscord, hasTelegram }: Props) {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const trophyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const onTrophyHover = () => {
    gsap.to(trophyRef.current, { rotation: 15, duration: 0.1, yoyo: true, repeat: 5, ease: "sine.inOut" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#FDF9F0]/80 backdrop-blur-xl border-b border-[rgba(91,70,54,0.06)]">
      <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
             <GuruMascot size={32} />
          </div>
          <img src="/watchmeguru.png" alt="WatchMeGuru" className="h-10 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.02)]">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[13px] font-extrabold transition-all hover:bg-white/50 text-[#3D2E24]"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            <LayoutDashboard size={16} className="text-moss" /> Dashboard
          </button>
          <div className="w-[1px] h-4 bg-[rgba(0,0,0,0.05)] mx-1" />
          <button 
            onClick={onOpenLeaderboard}
            onMouseEnter={onTrophyHover}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[13px] font-extrabold transition-all hover:bg-white text-[#D9A441] shadow-sm hover:shadow-md"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            <div ref={trophyRef} className="flex items-center justify-center">
              <Trophy size={16} fill="#FFC800" stroke="#D9A441" />
            </div>
            Hall of Gurus
          </button>
        </div>

        <div className="flex items-center gap-4">
          {mounted && !hasWhatsapp && (
            <button onClick={onSetup}
              className="flex items-center gap-1.5 text-[12px] font-bold py-2 px-3 rounded-full border"
              style={{ color: "#25D366", borderColor: "rgba(37,211,102,0.3)", background: "rgba(37,211,102,0.04)" }}>
              <Phone size={12} /> Connect WhatsApp
            </button>
          )}
          {scheduleLocked ? (
            <button onClick={onUnlock}
              className="flex items-center gap-1.5 text-[13px] font-semibold py-2 px-4 rounded-[14px] border transition-all cursor-pointer"
              style={{ color: "var(--ink-muted)", borderColor: "var(--border)", background: "rgba(91,70,54,0.02)" }}>
              <Lock size={13} strokeWidth={1.5} /> Locked
            </button>
          ) : (
            mounted ? (
              <button onClick={onSetup}
                className={hasSetup ? "btn-earthy text-[13px] py-2 px-4" : "btn-moss text-[13px] py-2 px-4"}>
                {hasSetup ? "Edit Setup" : "Setup"}
              </button>
            ) : (
              <div className="w-[90px] h-[36px]" />
            )
          )}
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-[13px] font-semibold" style={{ color: "var(--ink-light)" }}>
              {user?.firstName || "Student"}
            </span>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
