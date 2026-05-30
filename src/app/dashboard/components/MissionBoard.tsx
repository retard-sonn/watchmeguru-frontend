"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmptyBiome from "@/components/illustrations/EmptyBiome";
import { Sparkles } from "lucide-react";
import ProofUploader from "./ProofUploader";

interface Task {
  id: string;
  title: string;
  subject?: string;
  status: "pending" | "completed" | "in_progress" | "missed";
  due_date?: string;
}

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (taskId: string) => void;
}

const STATUS_META = {
  pending: { dot: "#D9A441", label: "Start", bg: "rgba(217,164,65,0.06)", verb: "Complete" },
  in_progress: { dot: "#7BA65B", label: "In Progress", bg: "rgba(123,166,91,0.08)", verb: "Continue" },
  completed: { dot: "#7BA65B", label: "Done! +50 XP", bg: "rgba(123,166,91,0.04)", verb: "Done" },
  missed: { dot: "#9B8E84", label: "Missed", bg: "rgba(155,142,132,0.04)", verb: "Missed" },
};

function formatDate(raw?: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch { return raw.slice(0, 10); }
}

export default function MissionBoard({ tasks, isLoading, onComplete }: Props) {
  const [celebrating, setCelebrating] = useState<string | null>(null);

  const handleComplete = useCallback((taskId: string) => {
    setCelebrating(taskId);
    onComplete(taskId);
    setTimeout(() => setCelebrating(null), 2000);
  }, [onComplete]);

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="card-terrain p-10 text-center">
            <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-moss border-t-transparent animate-spin" />
            <p className="text-[14px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading missions...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!tasks.length) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="card-terrain p-10 flex flex-col items-center text-center">
            <div className="mb-4"><EmptyBiome /></div>
            <h3 className="text-[16px] font-bold mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
              No missions yet
            </h3>
            <p className="text-[13px] font-medium" style={{ color: "var(--ink-light)" }}>
              Kickstart a study block to create your first mission.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="mission-board-title" className="text-[18px] font-bold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            Today&apos;s Missions
          </h2>
          <span className="text-[12px] font-semibold" style={{ color: "var(--ink-muted)" }}>
            {tasks.filter(t => t.status === "completed").length}/{tasks.length} done
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, i) => {
            const s = STATUS_META[task.status] || STATUS_META.pending;
            const date = formatDate(task.due_date);
            const isDone = task.status === "completed";
            const isCelebrating = celebrating === task.id;

            return (
              <motion.div
                key={task.id}
                className={`card-terrain p-4 flex items-start gap-4 group relative overflow-hidden ${isDone ? "opacity-60" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={isCelebrating ? { scale: [1, 1.03, 1] } : { opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                {/* Celebration overlay */}
                <AnimatePresence>
                  {isCelebrating && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                      style={{ background: "rgba(123,166,91,0.12)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Sparkles size={18} strokeWidth={1.5} color="#7BA65B" />
                        <span className="text-[16px] font-extrabold" style={{ color: "var(--moss)", fontFamily: "var(--font-baloo)" }}>+50 XP!</span>
                      </motion.div>
                      {/* Confetti dots */}
                      {["#7BA65B", "#D9A441", "#78A6D8", "#94A84D"].map((c, j) => (
                        <motion.div
                          key={j}
                          className="absolute rounded-full"
                          style={{ width: 6, height: 6, background: c, top: "50%", left: "50%" }}
                          initial={{ x: 0, y: 0, opacity: 1 }}
                          animate={{ x: (j - 1.5) * 30, y: -20 - j * 10, opacity: 0 }}
                          transition={{ duration: 0.8, delay: j * 0.08 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status indicator */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[16px]"
                  style={{ background: s.bg, color: s.dot }}
                >
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6 10.5L13 4" stroke="#7BA65B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full anim-pulse" style={{ background: s.dot }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--earthy)" }}>
                      {task.subject || task.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.dot }}>
                      {s.label}
                    </span>
                    {date && (
                      <span className="text-[11px] font-medium" style={{ color: "var(--ink-muted)" }}>{date}</span>
                    )}
                  </div>
                  {task.status !== "completed" && task.status !== "missed" && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="btn-moss text-[12px] py-1.5 px-4"
                      >
                        {s.verb} +50 XP
                      </button>
                      <ProofUploader
                        compact
                        taskTitle={task.subject || task.title}
                        onUploaded={(url) => console.log("Proof uploaded:", url)}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
