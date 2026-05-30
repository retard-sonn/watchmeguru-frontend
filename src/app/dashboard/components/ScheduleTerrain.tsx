"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import EmptyBiome from "@/components/illustrations/EmptyBiome";
import PlatformSelector from "./PlatformSelector";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Block {
  label: string;
  subject?: string;
  start?: string;
  startTime?: string;
  duration?: string;
  hours?: number;
  status?: "pending" | "in_progress" | "completed";
}

interface Props {
  blocks: Block[] | null;
  isLoading: boolean;
  isRest?: boolean;
  totalHours?: number;
  connectedPlatforms?: string[];
}

const SUBJECT_COLORS = ["#7BA65B", "#78A6D8", "#D9A441", "#94A84D", "#5B4636", "#7A6554", "#A8C8E8"];

function isBlockCurrent(startTimeStr: string, hours: number): boolean {
  if (!startTimeStr) return false;
  try {
    const match = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return false;
    
    let [_, hStr, mStr, meridiem] = match;
    let startHour = parseInt(hStr, 10);
    const startMin = parseInt(mStr, 10);
    
    if (meridiem.toUpperCase() === "PM" && startHour !== 12) {
      startHour += 12;
    } else if (meridiem.toUpperCase() === "AM" && startHour === 12) {
      startHour = 0;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    const startTotalMins = startHour * 60 + startMin;
    const durationMins = Math.round(hours * 60);
    const endTotalMins = startTotalMins + durationMins;
    
    const currentTotalMins = currentHour * 60 + currentMin;
    
    return currentTotalMins >= startTotalMins && currentTotalMins < endTotalMins;
  } catch (e) {
    return false;
  }
}

function SessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return (
    <span className="text-[12px] font-bold tabular-nums" style={{ color: "var(--moss)" }}>
      {mins}:{secs.toString().padStart(2, "0")} elapsed
    </span>
  );
}

export default function ScheduleTerrain({ blocks, isLoading, isRest, totalHours, connectedPlatforms = [] }: Props) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [blockStatuses, setBlockStatuses] = useState<Record<number, string>>({});
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [pendingBlockIndex, setPendingBlockIndex] = useState<number | null>(null);

  const platforms = connectedPlatforms.filter(Boolean);

  const kickstart = useMutation({
    mutationFn: async ({ blockIndex, platform }: { blockIndex: number; platform?: string }) => {
      const token = await getToken();
      const url = platform
        ? `${API_BASE}/api/v1/kickstart/${blockIndex}?platform=${platform}`
        : `${API_BASE}/api/v1/kickstart/${blockIndex}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Kickstart failed");
      return res.json();
    },
    onMutate: ({ blockIndex }) => {
      setBlockStatuses((prev) => ({ ...prev, [blockIndex]: "in_progress" }));
      setActiveBlock(blockIndex);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    },
    onError: (_, { blockIndex }) => {
      setBlockStatuses((prev) => ({ ...prev, [blockIndex]: "pending" }));
      setActiveBlock(null);
    },
  });

  const handleKickstart = (blockIndex: number) => {
    if (platforms.length > 1) {
      setPendingBlockIndex(blockIndex);
      setShowPlatformSelector(true);
    } else {
      const single = platforms[0] || undefined;
      kickstart.mutate({ blockIndex, platform: single });
    }
  };

  const handlePlatformSelect = (platform: string) => {
    setShowPlatformSelector(false);
    if (pendingBlockIndex !== null) {
      kickstart.mutate({ blockIndex: pendingBlockIndex, platform });
      setPendingBlockIndex(null);
    }
  };

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="card-terrain p-8 text-center">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-moss border-t-transparent animate-spin" />
            <p className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading schedule...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!blocks || !blocks.length || isRest) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="card-terrain p-10 flex flex-col items-center text-center">
            <div className="mb-4"><EmptyBiome /></div>
            <h3 className="text-[16px] font-bold mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
              {isRest ? "Rest Day" : "No schedule yet"}
            </h3>
            <p className="text-[13px] font-medium" style={{ color: "var(--ink-light)" }}>
              {isRest ? "Enjoy your recovery day. Growth happens during rest too." : "Run the Setup Wizard to generate your AI-powered study plan."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="card-terrain p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
              Your Study Terrain
            </h2>
            {totalHours && (
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                {totalHours}h today
              </span>
            )}
          </div>

          <div className="space-y-3" style={{ perspective: "600px" }}>
            {blocks.map((block, i) => {
              const start = block.start || block.startTime || "";
              const hours = block.hours || (block.duration ? parseFloat(block.duration.replace("h", "")) : 1.5);
              const duration = block.duration || `${hours}h`;
              const label = block.label || "";

              const status = blockStatuses[i] || block.status || "pending";
              const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
              
              const isTimeActive = isBlockCurrent(start, hours);
              const isNowBlock = isTimeActive && status !== "completed";
              
              const isActive = activeBlock === i || isNowBlock;
              const isInProgress = status === "in_progress" || isNowBlock;
              const isDone = status === "completed";

              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl group transition-all duration-300"
                  style={{
                    background: isNowBlock ? "rgba(217,164,65,0.08)" : isActive ? "rgba(123,166,91,0.08)" : isDone ? "rgba(91,70,54,0.01)" : "rgba(91,70,54,0.02)",
                    border: `2px solid ${isNowBlock ? "rgba(217,164,65,0.4)" : isActive ? "rgba(123,166,91,0.3)" : isDone ? "rgba(91,70,54,0.03)" : "rgba(91,70,54,0.06)"}`,
                    boxShadow: isNowBlock ? "0 0 24px rgba(217,164,65,0.16)" : isActive ? "0 0 24px rgba(123,166,91,0.12)" : "none",
                    transform: isActive ? "rotateX(2deg)" : "rotateX(0deg)",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ transform: "rotateX(3deg) translateY(-2px)" }}
                >
                  {/* Color bar with grass top */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-2.5 h-10 rounded-full" style={{ background: isNowBlock ? "#D9A441" : isActive ? "#7BA65B" : color }}>
                      {/* Grass tufts on top */}
                      {(isActive || isNowBlock) && (
                        <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 flex gap-[1px]">
                          {[0, 1, 2].map((j) => (
                            <motion.div
                              key={j}
                              className="w-[3px] rounded-t-full"
                              style={{ background: isNowBlock ? "#D9A441" : "#7BA65B" }}
                              animate={{ height: [3, 5, 3] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24">
                    <div className="flex items-center gap-1">
                      <p className="text-[12px] font-bold" style={{ color: "var(--earthy)" }}>{start}</p>
                      {isNowBlock && (
                        <span className="animate-pulse px-1 py-0.5 rounded text-[8px] uppercase font-bold text-white bg-mustard">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ink-muted)" }}>{duration}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--earthy)" }}>{label}</p>
                    {block.subject && <p className="text-[12px] font-medium mt-0.5" style={{ color: "var(--ink-muted)" }}>{block.subject}</p>}
                  </div>

                  <div className="flex-shrink-0">
                    {status === "completed" ? (
                      <span className="text-[12px] font-semibold flex items-center gap-1" style={{ color: "var(--moss)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7L5.5 9.5L11 4" stroke="#7BA65B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Done
                      </span>
                    ) : isActive && !isNowBlock ? (
                      <SessionTimer />
                    ) : isInProgress ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full anim-pulse" style={{ background: isNowBlock ? "#D9A441" : "#7BA65B" }} />
                        <span className="text-[12px] font-semibold" style={{ color: isNowBlock ? "var(--mustard-deep)" : "var(--moss)" }}>
                          {isNowBlock ? "Up Now" : "Active"}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleKickstart(i)}
                        disabled={kickstart.isPending}
                        className="btn-mustard text-[12px] py-2 px-4"
                      >
                        Kickstart
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <PlatformSelector
        open={showPlatformSelector}
        onClose={() => { setShowPlatformSelector(false); setPendingBlockIndex(null); }}
        onSelect={handlePlatformSelect}
        connectedPlatforms={platforms}
      />
    </section>
  );
}
