"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Medal, Globe, MapPin, Sparkles, X } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { getLevelFromXP } from "@/lib/levelSystem";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RankedStudent {
  rank: number; 
  name: string; 
  level: number; 
  xp: number; 
  streak: number; 
  country: string; 
  exam: string;
}

async function fetchLeaderboard(getToken: () => Promise<string|null>, type: "global"|"country", countryCode?: string) {
  const token = await getToken();
  const url = type === "global"
    ? `${API_BASE}/api/v1/leaderboard/global?limit=20`
    : `${API_BASE}/api/v1/leaderboard/country/${countryCode}?limit=20`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.leaderboard || []) as RankedStudent[];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-8 h-8 rounded-full bg-[#FFC800] flex items-center justify-center shadow-lg border-2 border-white"><Trophy size={16} color="white" fill="white" /></div>;
  if (rank === 2) return <div className="w-7 h-7 rounded-full bg-[#A8A8A8] flex items-center justify-center shadow-md border-2 border-white"><Medal size={14} color="white" fill="white" /></div>;
  if (rank === 3) return <div className="w-7 h-7 rounded-full bg-[#CD7F32] flex items-center justify-center shadow-md border-2 border-white"><Medal size={14} color="white" fill="white" /></div>;
  return <span className="text-[13px] font-extrabold" style={{ color: "#9B8E84", fontFamily: "var(--font-baloo)" }}>{rank}</span>;
}

interface LeaderboardProps { countryCode?: string; isOpen: boolean; onClose: () => void; }

export default function Leaderboard({ countryCode = "IN", isOpen, onClose }: LeaderboardProps) {
  const { getToken, isLoaded } = useAuth();
  const [view, setView] = useState<"global" | "country">("global");
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      tl.fromTo(contentRef.current, { y: 100, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }, "-=0.2");
    }
  }, [isOpen]);

  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ["leaderboard", "global"],
    queryFn: () => fetchLeaderboard(getToken, "global"),
    enabled: isLoaded && isOpen,
  });

  const { data: countryData, isLoading: countryLoading } = useQuery({
    queryKey: ["leaderboard", "country", countryCode],
    queryFn: () => fetchLeaderboard(getToken, "country", countryCode),
    enabled: isLoaded && !!countryCode && isOpen,
  });

  const data = view === "country" ? countryData : globalData;
  const isLoading = globalLoading || countryLoading;

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-[#3D2E24]/80 backdrop-blur-xl">
      <div 
        ref={contentRef}
        className="w-full max-w-4xl h-full max-h-[85vh] bg-[#FDF9F0] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-4 border-[rgba(217,164,65,0.2)]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC80015] flex items-center justify-center">
              <Trophy size={28} className="text-[#D9A441]" />
            </div>
            <div>
              <h2 className="text-[24px] font-black" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>Hall of Gurus</h2>
              <p className="text-[12px] font-bold text-[#9B8E84] uppercase tracking-widest">Global Rankings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-[rgba(0,0,0,0.05)] text-[#9B8E84] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 md:px-8 py-4 bg-[rgba(0,0,0,0.02)]">
          <div className="flex p-1.5 rounded-2xl bg-[rgba(0,0,0,0.06)] w-full max-w-md mx-auto">
            <button 
              onClick={() => setView("global")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-extrabold transition-all ${view === 'global' ? 'bg-white shadow-lg text-[#3D2E24]' : 'text-[#9B8E84]'}`}
            >
              <Globe size={18} /> Global
            </button>
            <button 
              onClick={() => setView("country")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-extrabold transition-all ${view === 'country' ? 'bg-white shadow-lg text-[#3D2E24]' : 'text-[#9B8E84]'}`}
            >
              <MapPin size={18} /> My Country
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 rounded-3xl animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data && data.length > 0 ? data.map((s, i) => {
                const levelInfo = getLevelFromXP(s.xp);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] bg-white border-2 border-[rgba(0,0,0,0.03)] hover:border-[rgba(217,164,65,0.3)] transition-all group"
                  >
                    <div className="w-10 flex justify-center flex-shrink-0">
                      <RankBadge rank={s.rank} />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <div className="flex-shrink-0 shadow-md border-2 border-white rounded-lg overflow-hidden flex items-center">
                        <ReactCountryFlag countryCode={s.country} svg style={{ width: 32, height: 22 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-bold truncate group-hover:text-[#58CC02] transition-colors" style={{ color: "#3D2E24" }}>{s.name}</p>
                        <p className="text-[12px] font-extrabold uppercase tracking-tight" style={{ color: levelInfo.color }}>
                          {levelInfo.title} <span className="text-[#9B8E84] font-medium opacity-60">· Lv.{s.level}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[18px] font-black" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
                        {s.xp.toLocaleString()}
                        <span className="text-[11px] ml-1 text-[#9B8E84]">XP</span>
                      </p>
                      {s.streak > 0 && (
                        <p className="text-[11px] font-bold text-[#FF7A00]">
                          🔥 {s.streak} day streak
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="py-20 text-center flex flex-col items-center opacity-40">
                  <Globe size={60} className="mb-4" />
                  <p className="text-[16px] font-bold">The Hall is currently empty.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
