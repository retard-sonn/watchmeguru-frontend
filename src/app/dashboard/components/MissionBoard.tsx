"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import EmptyBiome from "@/components/illustrations/EmptyBiome";
import { Sparkles, ShieldCheck, ShieldAlert, X as XIcon } from "lucide-react";
import ProofUploader from "./ProofUploader";

interface Task {
  id: string;
  title: string;
  subject?: string;
  status: "pending" | "completed" | "in_progress" | "missed";
  due_date?: string;
}

interface VerifyResult {
  verdict: "verified" | "partial" | "unrelated";
  feedback: string;
  xp_awarded: number;
  confidence: number;
}

interface MilestoneEvent {
  type: "first_session" | "proof_verified" | "proof_partial" | "all_done";
  xp?: number;
  feedback?: string;
}

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (taskId: string) => void;
  totalCompleted?: number;   // all-time tasks_completed from profile
  onMilestone?: (event: MilestoneEvent) => void;
}

const STATUS_META = {
  pending:     { dot: "#D9A441", label: "Start",       bg: "rgba(217,164,65,0.06)",  verb: "Complete" },
  in_progress: { dot: "#7BA65B", label: "In Progress", bg: "rgba(123,166,91,0.08)",  verb: "Continue" },
  completed:   { dot: "#7BA65B", label: "Done! +50 XP",bg: "rgba(123,166,91,0.04)",  verb: "Done"     },
  missed:      { dot: "#9B8E84", label: "Missed",      bg: "rgba(155,142,132,0.04)", verb: "Missed"   },
};

const CONFETTI_COLORS = ["#7BA65B", "#D9A441", "#78A6D8", "#94A84D", "#58CC02", "#FFC800", "#FF7A00"];

function formatDate(raw?: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch { return raw.slice(0, 10); }
}

function MiniConfetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: 6 + (i % 3) * 2,
            height: 6 + (i % 3) * 2,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            top: "50%",
            left: "50%",
            "--confetti-y": `${-60 - Math.random() * 80}px`,
            "--confetti-x": `${(Math.random() - 0.5) * 120}px`,
            "--confetti-r": `${Math.random() * 720 - 360}deg`,
          } as React.CSSProperties}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0.6],
            opacity: [1, 1, 0],
            x: [(Math.random() - 0.5) * 120],
            y: [-60 - Math.random() * 80],
            rotate: [0, Math.random() * 720 - 360],
          }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function MissionBoard({ tasks, isLoading, onComplete, totalCompleted = 0, onMilestone }: Props) {
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [proofResults, setProofResults] = useState<Record<string, VerifyResult>>({});
  const [proofExpanded, setProofExpanded] = useState<string | null>(null);

  const handleComplete = useCallback((taskId: string) => {
    setCelebrating(taskId);
    onComplete(taskId);

    // Check for first session milestone
    const wasFirstSession = totalCompleted === 0;
    setTimeout(() => {
      setCelebrating(null);
      if (wasFirstSession && onMilestone) {
        onMilestone({ type: "first_session", xp: 50 });
      }
      // Check if all tasks are now done
      const pending = tasks.filter(t => t.id !== taskId && t.status !== "completed" && t.status !== "missed");
      if (pending.length === 0 && tasks.length > 0 && onMilestone) {
        setTimeout(() => onMilestone({ type: "all_done", xp: 100 }), 600);
      }
    }, 2000);
  }, [onComplete, totalCompleted, tasks, onMilestone]);

  const handleProofUploaded = useCallback((taskId: string, task: Task) => {
    return (_fileUrl: string, result?: VerifyResult) => {
      if (!result) return;
      setProofResults(prev => ({ ...prev, [taskId]: result }));

      if (onMilestone) {
        if (result.verdict === "verified") {
          onMilestone({ type: "proof_verified", xp: result.xp_awarded, feedback: result.feedback });
        } else if (result.verdict === "partial") {
          onMilestone({ type: "proof_partial", xp: result.xp_awarded, feedback: result.feedback });
        }
      }
    };
  }, [onMilestone]);

  if (isLoading) {
    return (
      <div className="card-terrain p-6 text-center">
        <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-moss border-t-transparent animate-spin" />
        <p className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading missions...</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="card-terrain p-6 flex flex-col items-center text-center">
        <div className="mb-3"><EmptyBiome /></div>
        <h3 className="text-[15px] font-extrabold mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
          No missions yet
        </h3>
        <p className="text-[12px] font-medium" style={{ color: "var(--ink-light)" }}>
          Kickstart a block to begin.
        </p>
      </div>
    );
  }

  const doneCount = tasks.filter(t => t.status === "completed").length;
  const allDone = doneCount === tasks.length;

  return (
    <div className="card-terrain p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 id="mission-board-title" className="text-[18px] font-bold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
          Today&apos;s Missions
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold" style={{ color: allDone ? "#58CC02" : "var(--ink-muted)" }}>
            {doneCount}/{tasks.length} done
          </span>
          {allDone && (
            <motion.span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(88,204,2,0.1)", color: "#58CC02" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              🎉 All clear!
            </motion.span>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, i) => {
          const s = STATUS_META[task.status] || STATUS_META.pending;
          const date = formatDate(task.due_date);
          const isDone = task.status === "completed";
          const isCelebrating = celebrating === task.id;
          const proof = proofResults[task.id];
          const isProofOpen = proofExpanded === task.id;

          return (
            <motion.div
              key={task.id}
              className={`card-terrain p-4 flex flex-col gap-3 group relative overflow-hidden ${isDone ? "opacity-60" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              {/* Celebration overlay + confetti */}
              <AnimatePresence>
                {isCelebrating && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                    style={{ background: "rgba(123,166,91,0.12)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MiniConfetti />
                    <motion.div
                      className="flex items-center gap-1.5 relative z-20"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <Sparkles size={18} strokeWidth={1.5} color="#7BA65B" />
                      <span className="text-[16px] font-extrabold" style={{ color: "var(--moss)", fontFamily: "var(--font-baloo)" }}>+50 XP!</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top row — status + title */}
              <div className="flex items-start gap-3">
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
                  <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--earthy)" }}>
                    {task.subject || task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.dot }}>
                      {s.label}
                    </span>
                    {date && <span className="text-[11px] font-medium" style={{ color: "var(--ink-muted)" }}>{date}</span>}
                  </div>
                </div>
              </div>

              {/* Proof result badge (if verified) */}
              <AnimatePresence>
                {proof && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold"
                      style={{
                        background: proof.verdict === "verified" ? "rgba(88,204,2,0.06)" : proof.verdict === "partial" ? "rgba(217,164,65,0.06)" : "rgba(220,38,38,0.05)",
                        border: `1px solid ${proof.verdict === "verified" ? "rgba(88,204,2,0.15)" : proof.verdict === "partial" ? "rgba(217,164,65,0.15)" : "rgba(220,38,38,0.1)"}`,
                        color: proof.verdict === "verified" ? "#58CC02" : proof.verdict === "partial" ? "#D9A441" : "#DC2626",
                      }}
                    >
                      {proof.verdict === "verified" ? <ShieldCheck size={13} /> : proof.verdict === "partial" ? <ShieldAlert size={13} /> : <XIcon size={13} />}
                      <span className="flex-1 truncate italic" style={{ color: "#6B5D52" }}>{proof.feedback}</span>
                      {proof.xp_awarded > 0 && (
                        <span className="font-extrabold" style={{ color: proof.verdict === "verified" ? "#58CC02" : "#D9A441" }}>
                          +{proof.xp_awarded} XP
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action row */}
              {task.status !== "completed" && task.status !== "missed" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="btn-moss text-[12px] py-1.5 px-4"
                  >
                    {s.verb} +50 XP
                  </button>

                  {/* Proof uploader — toggle */}
                  {!proof ? (
                    isProofOpen ? (
                      <div className="flex-1">
                        <ProofUploader
                          compact
                          taskTitle={task.subject || task.title}
                          subject={task.subject}
                          onUploaded={handleProofUploaded(task.id, task)}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setProofExpanded(task.id)}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-all"
                        style={{ borderColor: "rgba(88,204,2,0.2)", color: "#58CC02", background: "rgba(88,204,2,0.03)" }}
                      >
                        <ShieldCheck size={12} /> Verify +50XP
                      </button>
                    )
                  ) : null}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
