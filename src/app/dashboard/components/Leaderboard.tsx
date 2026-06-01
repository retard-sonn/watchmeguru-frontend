"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Trophy, Medal, Globe } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RankedStudent {
  rank: number; name: string; level: number; xp: number; streak: number; country: string; exam: string;
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
  if (rank === 1) return <Trophy size={18} style={{ color: "#D9A441" }} />;
  if (rank === 2) return <Medal size={18} style={{ color: "#A8A8A8" }} />;
  if (rank === 3) return <Medal size={18} style={{ color: "#CD7F32" }} />;
  return <span className="text-[13px] font-extrabold" style={{ color: "#9B8E84", fontFamily: "var(--font-baloo)" }}>{rank}</span>;
}

interface LeaderboardProps { countryCode?: string; }

export default function Leaderboard({ countryCode = "IN" }: LeaderboardProps) {
  const { getToken, isLoaded } = useAuth();

  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ["leaderboard", "global"],
    queryFn: () => fetchLeaderboard(getToken, "global"),
    enabled: isLoaded,
    refetchInterval: 60000,
  });

  const { data: countryData, isLoading: countryLoading } = useQuery({
    queryKey: ["leaderboard", "country", countryCode],
    queryFn: () => fetchLeaderboard(getToken, "country", countryCode),
    enabled: isLoaded && !!countryCode,
    refetchInterval: 60000,
  });

  const data = countryData?.length ? countryData : globalData;
  const isLoading = globalLoading || countryLoading;

  return (
    <div className="rounded-2xl p-5" style={{ border: "1.5px solid rgba(0,0,0,0.04)", background: "rgba(0,0,0,0.01)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} style={{ color: "#D9A441" }} />
          <h3 className="text-[15px] font-extrabold" style={{ color: "#3D2E24", fontFamily: "var(--font-baloo)" }}>
            {countryData?.length ? `Leaderboard` : "Global Leaderboard"}
          </h3>
        </div>
        {countryData?.length ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(88,204,2,0.06)" }}>
            <ReactCountryFlag countryCode={countryCode} svg style={{ width: 14, height: 10, borderRadius: 2 }} />
            <span className="text-[10px] font-bold" style={{ color: "#58CC02" }}>{countryCode}</span>
          </div>
        ) : (
          <Globe size={14} style={{ color: "#9B8E84" }} />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "rgba(0,0,0,0.02)" }} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {data?.slice(0, 10).map((s, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
              style={{ background: s.rank <= 3 ? "rgba(88,204,2,0.03)" : "transparent" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="w-8 flex justify-center"><RankBadge rank={s.rank} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold truncate" style={{ color: "#3D2E24" }}>{s.name}</p>
                <p className="text-[10px] font-medium" style={{ color: "#9B8E84" }}>Lv.{s.level} · 🔥 {s.streak}d</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-extrabold" style={{ color: "#58CC02", fontFamily: "var(--font-baloo)" }}>{s.xp.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase" style={{ color: "#9B8E84" }}>XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
