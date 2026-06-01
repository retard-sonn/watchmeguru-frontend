"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Lock, Phone } from "lucide-react";

interface Props {
  onSetup: () => void;
  onUnlock: () => void;
  hasSetup: boolean;
  scheduleLocked: boolean;
  hasWhatsapp: boolean;
  hasDiscord: boolean;
  hasTelegram: boolean;
}

export default function DashboardNav({ onSetup, onUnlock, hasSetup, scheduleLocked, hasWhatsapp, hasDiscord, hasTelegram }: Props) {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-parchment/90 backdrop-blur-xl shadow-[0_1px_0_rgba(91,70,54,0.06)]">
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[18px] font-extrabold tracking-tight" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            WatchMe<span style={{ color: "var(--moss)" }}>Guru</span><span className="text-[11px] font-medium ml-0.5" style={{ color: "var(--ink-muted)" }}>.io</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-[13px] font-semibold" style={{ color: "var(--moss)" }}>Dashboard</span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(217,164,65,0.12)", color: "#D9A441" }}>Beta</span>
          {mounted && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: hasWhatsapp ? "#25D366" : "#9B8E84" }} title={hasWhatsapp ? "WhatsApp connected" : "WhatsApp not connected"} />
              {hasDiscord && <div className="w-2 h-2 rounded-full" style={{ background: "#5865F2" }} title="Discord connected" />}
              {hasTelegram && <div className="w-2 h-2 rounded-full" style={{ background: "#0088cc" }} title="Telegram connected" />}
            </div>
          )}
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
