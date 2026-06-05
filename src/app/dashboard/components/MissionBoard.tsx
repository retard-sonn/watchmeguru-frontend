"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import EmptyBiome from "@/components/illustrations/EmptyBiome";
import { Sparkles, ShieldCheck, ShieldAlert, X as XIcon, Clock, Check, PlayCircle } from "lucide-react";
import ProofUploader from "./ProofUploader";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";

interface Task {
  id: string;
  title: string;
  subject?: string;
  status: "pending" | "completed" | "in_progress" | "missed";
  due_date?: string;
  start_time?: string;
  hours?: number;
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
  onStart: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  totalCompleted?: number;   // all-time tasks_completed from profile
  onMilestone?: (event: MilestoneEvent) => void;
}

const STATUS_META = {
  pending:     { dot: "#D9A441", label: "Upcoming",    bg: "rgba(217,164,65,0.06)",  verb: "Start Session" },
  in_progress: { dot: "#58CC02", label: "Active Now",  bg: "rgba(88,204,2,0.08)",    verb: "Resume" },
  completed:   { dot: "#7BA65B", label: "Completed",   bg: "rgba(123,166,91,0.04)",  verb: "Done" },
  missed:      { dot: "#9B8E84", label: "Missed",      bg: "rgba(155,142,132,0.04)", verb: "Missed" },
};

const CONFETTI_COLORS = ["#7BA65B", "#D9A441", "#78A6D8", "#94A84D", "#58CC02", "#FFC800", "#FF7A00"];

function parseTimeString(raw: string): {h:number, m:number} | null {
  if (!raw) return null;
  const standardMatch = raw.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (standardMatch) {
    let h = parseInt(standardMatch[1]);
    const m = parseInt(standardMatch[2]);
    const mer = standardMatch[3].toUpperCase();
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return {h, m};
  }
  const militaryMatch = raw.match(/(\d{1,2}):(\d{2})/);
  if (militaryMatch) {
    return {h: parseInt(militaryMatch[1]), m: parseInt(militaryMatch[2])};
  }
  return null;
}

function getEndTime(startTime: string, hours: number): string {
  try {
    const parsed = parseTimeString(startTime);
    if (!parsed) return "";
    const totalMinutes = parsed.h * 60 + parsed.m + Math.round(hours * 60);
    let endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const endMer = endH >= 12 ? "PM" : "AM";
    const displayH = endH % 12 || 12;
    return `${displayH}:${endM.toString().padStart(2, "0")} ${endMer}`;
  } catch { return ""; }
}

function getStatusByTime(startTime: string | undefined, hours: number): { active: boolean; label: string; color: string; status: "future" | "active" | "missed" } {
  if (!startTime) return { active: true, label: "Ready", color: "#58CC02", status: "active" };
  
  const parsed = parseTimeString(startTime);
  // If parsing fails, default to active so user isn't permanently locked out due to a typo.
  if (!parsed) return { active: true, label: "Ready", color: "#58CC02", status: "active" };
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = parsed.h * 60 + parsed.m;
  const endMinutes = startMinutes + Math.round(hours * 60);
  
  if (currentMinutes < startMinutes) {
    return { active: false, label: `Starts at ${startTime}`, color: "#9B8E84", status: "future" };
  } else if (currentMinutes > endMinutes) {
    // STRICT TIME GATING: If the session window has passed, lock it completely.
    return { active: false, label: "Missed", color: "#FF4B4B", status: "missed" };
  }
  return { active: true, label: "Start Session", color: "#58CC02", status: "active" };
}

function formatDate(raw?: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch { return raw.slice(0, 10); }
}

export default function MissionBoard({ tasks, isLoading, onStart, onComplete, totalCompleted = 0, onMilestone }: Props) {
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [proofResults, setProofResults] = useState<Record<string, VerifyResult>>({});
  const [proofExpanded, setProofExpanded] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance
  useEffect(() => {
    if (!containerRef.current || isLoading || !tasks.length) return;
    gsap.fromTo(containerRef.current.querySelectorAll(".mission-card"), 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
    );
  }, [isLoading, tasks.length]);

  const handleComplete = useCallback((taskId: string, xpAmount: number) => {
    setCelebrating(taskId);
    onComplete(taskId);

    const wasFirstSession = totalCompleted === 0;
    setTimeout(() => {
      setCelebrating(null);
      if (wasFirstSession && onMilestone) {
        onMilestone({ type: "first_session", xp: xpAmount });
      }
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
        if (result.verdict === "verified") onMilestone({ type: "proof_verified", xp: result.xp_awarded, feedback: result.feedback });
        else if (result.verdict === "partial") onMilestone({ type: "proof_partial", xp: result.xp_awarded, feedback: result.feedback });
      }
    };
  }, [onMilestone]);

  if (isLoading) return <div className="card-terrain p-6 text-center"><div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-moss border-t-transparent animate-spin" /><p className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading missions...</p></div>;

  if (!tasks.length) return <div className="card-terrain p-6 flex flex-col items-center text-center"><div className="mb-3"><EmptyBiome /></div><h3 className="text-[15px] font-extrabold mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>No missions yet</h3><p className="text-[12px] font-medium" style={{ color: "var(--ink-light)" }}>Kickstart a block to begin.</p></div>;

  const doneCount = tasks.filter(t => t.status === "completed").length;
  const allDone = doneCount === tasks.length;

  return (
    <div className="card-terrain p-5" ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <h2 id="mission-board-title" className="text-[20px] font-bold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
          Daily Missions
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold" style={{ color: allDone ? "#58CC02" : "var(--ink-muted)" }}>
            {doneCount}/{tasks.length} MISSION{tasks.length!==1?'S':''} CLEAR
          </span>
          {allDone && <motion.span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(88,204,2,0.1)", color: "#58CC02" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>🎉 ALL DONE</motion.span>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task, i) => {
          const timeMeta = getStatusByTime(task.start_time, task.hours || 1);
          const isDone = task.status === "completed";
          const isCelebrating = celebrating === task.id;
          const proof = proofResults[task.id];
          const isProofOpen = proofExpanded === task.id;
          const hours = task.hours || 1;
          const xp = Math.round(hours * 50);
          const endTime = task.start_time ? getEndTime(task.start_time, hours) : "";
          const Icon = getSubjectIcon(task.subject || task.title);

          const s = isDone ? STATUS_META.completed : (task.status === "in_progress" ? STATUS_META.in_progress : STATUS_META.pending);
          const currentLabel = isDone ? "Completed" : timeMeta.label;
          const isActive = !isDone && timeMeta.active;

          return (
            <motion.div
              key={task.id}
              className={`mission-card card-terrain p-4 flex flex-col gap-3 group relative overflow-hidden transition-all duration-300 ${isDone ? "opacity-60 grayscale-[0.3]" : (isActive ? "hover:shadow-xl hover:-translate-y-1" : "opacity-80")}`}
              style={{ 
                border: isDone ? "1.5px solid rgba(123,166,91,0.1)" : (task.status === "in_progress" ? "#58CC02" : (isActive ? "1.5px solid #D9A441" : "1.5px solid rgba(0,0,0,0.05)")),
                background: task.status === "in_progress" ? "linear-gradient(170deg, #F9FFF0 0%, #FFFFFF 100%)" : "white"
              }}
              whileHover={{ scale: (isDone || !isActive) ? 1 : 1.02 }}
            >
              {/* Shine effect for high XP active missions */}
              {xp >= 100 && isActive && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]" animate={{ left: "200%" }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} />
                </div>
              )}

              <AnimatePresence>
                {isCelebrating && (
                  <motion.div className="absolute inset-0 rounded-2xl flex items-center justify-center z-20" style={{ background: "rgba(123,166,91,0.15)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex flex-col items-center">
                      <Sparkles size={24} className="text-[#7BA65B] mb-1" />
                      <span className="text-[18px] font-extrabold" style={{ color: "var(--moss)", fontFamily: "var(--font-baloo)" }}>+{xp} XP!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-[rgba(0,0,0,0.02)]">
                  <Icon />
                  {isDone && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#58CC02] border-2 border-white flex items-center justify-center shadow-sm">
                      <Check size={14} color="white" strokeWidth={4} />
                    </div>
                  )}
                  {(task.status === "in_progress" || (isActive && !isDone)) && (
                    <motion.div className="absolute inset-0 rounded-2xl border-2" style={{borderColor: task.status === "in_progress" ? "#58CC02" : "#D9A44120"}} animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold leading-tight line-clamp-2 capitalize" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                    {task.subject || task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ background: isDone? s.bg : (isActive? "rgba(88,204,2,0.1)":"rgba(0,0,0,0.05)"), color: isDone? s.dot : (isActive? "#58CC02":"#9B8E84"), border: `1px solid ${isDone? s.dot : (isActive? "#58CC02":"#9B8E84")}20` }}>
                      {currentLabel}
                    </span>
                    {task.start_time && (
                      <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: isActive ? "#D9A441" : "#9B8E84" }}>
                        <Clock size={11} /> {task.start_time}{endTime ? ` - ${endTime}` : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2 flex flex-col gap-2">
                {/* XP Indicator */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.03)]">
                  <span className="text-[10px] font-bold text-[#9B8E84] uppercase">Reward</span>
                  <span className="text-[12px] font-extrabold text-[#58CC02]" style={{ fontFamily: "var(--font-baloo)" }}>+{xp} XP</span>
                </div>

                {/* Main Action */}
                {!isDone && task.status !== "missed" && (
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => isActive && onStart(task.id)}
                      disabled={!isActive}
                      className={`flex-1 flex items-center justify-center gap-2 text-[12px] font-extrabold py-2.5 px-4 rounded-xl transition-all ${
                        task.status === "in_progress" 
                        ? "bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] hover:translate-y-[1px] hover:shadow-[0_3px_0_#46A302]" 
                        : (isActive 
                           ? "bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] hover:translate-y-[1px] hover:shadow-[0_3px_0_#46A302]" 
                           : "bg-[rgba(0,0,0,0.04)] text-[#9B8E84] cursor-not-allowed")
                      }`}
                    >
                      {(task.status === "in_progress" || isActive) ? <PlayCircle size={14} fill="white" /> : <Clock size={14} />}
                      {currentLabel}
                    </button>

                    {isActive && !proof && !isProofOpen && (
                      <button onClick={() => setProofExpanded(task.id)} className="p-2.5 rounded-xl border-2 border-[rgba(88,204,2,0.2)] bg-[rgba(88,204,2,0.05)] text-[#58CC02] hover:bg-[rgba(88,204,2,0.1)] transition-all">
                        <ShieldCheck size={16} />
                      </button>
                    )}
                  </div>
                )}
                
                {isProofOpen && !proof && (
                  <div className="mt-1">
                    <ProofUploader compact taskTitle={task.subject || task.title} subject={task.subject} onUploaded={handleProofUploaded(task.id, task)} />
                  </div>
                )}

                {proof && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold mt-1" style={{ background: proof.verdict === "verified" ? "rgba(88,204,2,0.06)" : "rgba(217,164,65,0.06)", border: `1px solid ${proof.verdict === "verified" ? "#58CC0240" : "#D9A44140"}`, color: proof.verdict === "verified" ? "#58CC02" : "#D9A441" }}>
                    {proof.verdict === "verified" ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                    <span className="flex-1 truncate italic">{proof.feedback}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
