"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { GraduationCap, Atom, Calendar, Sword, Scale, Sprout, Sparkles, TriangleAlert, ArrowLeft, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SetupWizardProps {
  onComplete: () => void;
  onDismiss: () => void;
  getToken: () => Promise<string | null>;
}

const MODES = [
  { id: "strict", title: "Strict", desc: "Daily check-ins. Miss 3 days — parent gets full report. No exceptions.", Icon: Sword, color: "#DC2626", bg: "rgba(220,38,38,0.04)" },
  { id: "moderate", title: "Moderate", desc: "Firm but fair. Warnings before escalation. Weekly parent reports.", Icon: Scale, color: "#D9A441", bg: "rgba(217,164,65,0.06)" },
  { id: "own_pace", title: "Own Pace", desc: "Supportive mentor only. No parent alerts. For the self-disciplined.", Icon: Sprout, color: "#7BA65B", bg: "rgba(123,166,91,0.06)" },
] as const;

const PRESET_SUBJECTS = ["Physics", "Chemistry", "Math", "Biology", "History", "Geography", "Polity", "Economics", "Aptitude", "English"];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\+\-\(\)]/g, "").replace(/^91/, "");
}

export default function SetupWizard({ onComplete, onDismiss, getToken }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [focusSubjects, setFocusSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [mode, setMode] = useState<"strict" | "moderate" | "own_pace" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [generatingSchedule, setGeneratingSchedule] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (loaded) return;
    try {
      const raw = localStorage.getItem("wmg_profile");
      if (!raw) { setLoaded(true); return; }
      const saved = JSON.parse(raw);
      if (saved.exam_type) setExamType(saved.exam_type);
      if (saved.exam_date) setExamDate(saved.exam_date);
      if (saved.focus_subjects) {
        const subjects = typeof saved.focus_subjects === "string"
          ? (saved.focus_subjects as string).split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        setFocusSubjects(subjects);
      }
      if (saved.channel_handle) setStudentPhone(saved.channel_handle);
      if (saved.guardian_contact) setParentPhone(saved.guardian_contact);
      if (saved.mode && ["strict", "moderate", "own_pace"].includes(saved.mode)) {
        setMode(saved.mode);
      }
    } catch {}
    setLoaded(true);
  }, [loaded]);

  const stepsCount = 4;

  const samePhoneError = normalizePhone(studentPhone) === normalizePhone(parentPhone) && studentPhone.trim() && parentPhone.trim();

  const step1Valid = examType.trim() && examDate.trim();
  const step2Valid = studentPhone.trim() && parentPhone.trim() && !samePhoneError;
  const step3Valid = mode !== null;
  // Step 4 is always valid (review page)

  const nextDisabled =
    (step === 1 && !step1Valid) ||
    (step === 2 && !step2Valid) ||
    (step === 3 && !step3Valid);

  const inputClass = "w-full px-4 py-3.5 rounded-[14px] border text-[14px] outline-none transition-all";
  const inputStyle: React.CSSProperties = { borderColor: "rgba(91,70,54,0.12)", background: "#F4EEDB", color: "var(--earthy)" };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setGeneratingSchedule(true);
    
    let generatedSchedule = null;
    const token = await getToken();
    
    // First, call AI to generate schedule
    try {
      const aiRes = await fetch(`${API_BASE}/api/v1/ai/generate-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          exam_type: examType,
          focus_subjects: focusSubjects.length > 0 ? focusSubjects.join(", ") : null,
          user_prompt: userPrompt || "Balanced schedule with regular breaks",
        }),
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        if (aiData.success && aiData.schedule) {
          generatedSchedule = aiData.schedule;
        }
      } else {
        console.warn("AI schedule generation returned non-ok status:", aiRes.status);
      }
    } catch (e) {
      console.warn("Could not generate AI schedule:", e);
    }
    
    setGeneratingSchedule(false);
    
    const profileData = {
      exam_type: examType,
      exam_date: examDate || null,
      focus_subjects: focusSubjects.length > 0 ? focusSubjects.join(", ") : null,
      mode,
      guardian_contact: parentPhone || null,
      preferred_channel: "whatsapp" as const,
      channel_handle: studentPhone || null,
      schedule_locked: mode === "strict",
      setup_complete: true,
      schedule_data: generatedSchedule,
    };
    
    localStorage.setItem("wmg_profile", JSON.stringify(profileData));
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/onboarding/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Setup failed on the server.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn("Backend offline — profile saved locally.");
    }
    
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(61,46,36,0.45)", backdropFilter: "blur(18px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: "93vh", background: "#FDF9F0" }}>

        {/* Header */}
        <div className="px-8 py-5 flex-shrink-0" style={{ background: "linear-gradient(165deg, #3D2E24 0%, #5B4636 60%, #7BA65B 100%)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[18px] font-extrabold tracking-tight" style={{ color: "#FDF9F0", fontFamily: "var(--font-baloo)" }}>
              WatchMe<span style={{ color: "var(--mustard)" }}>Guru</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(253,249,240,0.8)" }}>
                Step {step} of {stepsCount}
              </span>
              <button onClick={onDismiss} className="w-7 h-7 rounded-full flex items-center justify-center text-[18px] hover:bg-white/10"
                style={{ color: "rgba(253,249,240,0.5)" }}>×</button>
            </div>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "var(--mustard)" }}
              animate={{ width: `${(step / stepsCount) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ═══ STEP 1 — Your Mission ═══ */}
            {step === 1 && (
              <motion.div key="s1" className="p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-[24px] font-extrabold tracking-tight mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  Your Mission
                </h2>
                <p className="text-[14px] mb-7" style={{ color: "var(--ink-light)" }}>What exam are you preparing for?</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Target Exam</label>
                    <input type="text" placeholder="e.g. JEE Advanced, NEET, UPSC, CAT, NDA…" value={examType}
                      onChange={(e) => setExamType(e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Exam Date</label>
                    <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Subjects</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PRESET_SUBJECTS.map((subj) => {
                        const sel = focusSubjects.includes(subj);
                        return (
                          <button key={subj} onClick={() => sel ? setFocusSubjects(p => p.filter(s => s !== subj)) : setFocusSubjects(p => [...p, subj])}
                            className="text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all"
                            style={{ borderColor: sel ? "rgba(217,164,65,0.4)" : "rgba(91,70,54,0.1)", color: sel ? "#C08A2E" : "var(--ink-light)", background: sel ? "rgba(217,164,65,0.08)" : "transparent" }}>
                            {sel ? "✓ " : "+ "}{subj}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add custom subject..." value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && customSubject.trim()) { setFocusSubjects(p => [...p, customSubject.trim()]); setCustomSubject(""); } }}
                        className={`${inputClass} flex-1`} style={inputStyle} />
                      <button onClick={() => { if (customSubject.trim()) { setFocusSubjects(p => [...p, customSubject.trim()]); setCustomSubject(""); } }}
                        className="btn-mustard text-[14px] py-3.5 px-5">Add</button>
                    </div>
                    {focusSubjects.filter(s => !PRESET_SUBJECTS.includes(s)).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {focusSubjects.filter(s => !PRESET_SUBJECTS.includes(s)).map(s => (
                          <span key={s} className="text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                            style={{ background: "rgba(91,70,54,0.04)", color: "var(--ink-light)", border: "1px solid rgba(91,70,54,0.08)" }}>
                            {s}
                            <button onClick={() => setFocusSubjects(p => p.filter(x => x !== s))} style={{ color: "var(--ink-muted)" }}>×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2 — Connect WhatsApp ═══ */}
            {step === 2 && (
              <motion.div key="s2" className="p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-[24px] font-extrabold tracking-tight mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  Connect WhatsApp
                </h2>
                <p className="text-[14px] mb-7" style={{ color: "var(--ink-light)" }}>
                  WhatsApp is where your mentor lives. You&apos;ll send study proof, get check-ins, and receive session notifications here.
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                      Your WhatsApp Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <PhoneInput international defaultCountry="IN" value={studentPhone}
                      onChange={(value) => setStudentPhone(value || "")}
                      className="w-full px-4 py-3.5 rounded-[14px] border text-[14px] bg-[#F4EEDB]"
                      style={{ borderColor: "rgba(91,70,54,0.12)" }} />
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: "var(--ink-muted)" }}>
                      You&apos;ll send photos of your notebook here after each session.
                    </p>
                  </div>
                  <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                      Parent&apos;s WhatsApp <span className="text-[#DC2626]">*</span>
                    </label>
                    <PhoneInput international defaultCountry="IN" value={parentPhone}
                      onChange={(value) => setParentPhone(value || "")}
                      className="w-full px-4 py-3.5 rounded-[14px] border text-[14px] bg-[#F4EEDB]"
                      style={{ borderColor: "rgba(91,70,54,0.12)" }} />
                  </div>
                  {samePhoneError && (
                    <p className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "#DC2626" }}>
                      <TriangleAlert size={13} /> Your number cannot be the same as your parent&apos;s number.
                    </p>
                  )}
                  <div className="p-4 rounded-2xl" style={{ background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.12)" }}>
                    <p className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "#25D366" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                      Messages are free via WhatsApp
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3 — Discipline Level ═══ */}
            {step === 3 && (
              <motion.div key="s3" className="p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-[24px] font-extrabold tracking-tight mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  Discipline Level
                </h2>
                <p className="text-[14px] mb-7" style={{ color: "var(--ink-light)" }}>How much accountability do you need?</p>
                <div className="space-y-3">
                  {MODES.map((m) => (
                    <div key={m.id} onClick={() => setMode(m.id)}
                      className="cursor-pointer flex items-start gap-4 p-5 rounded-2xl border-2 transition-all"
                      style={{ borderColor: mode === m.id ? m.color : "rgba(91,70,54,0.07)", background: mode === m.id ? m.bg : "#FDF9F0" }}>
                      <div className="mt-0.5 flex-shrink-0" style={{ color: m.color }}><m.Icon size={22} strokeWidth={1.5} /></div>
                      <div className="flex-1">
                        <h3 className="text-[15px] font-bold mb-0.5" style={{ color: "var(--earthy)" }}>{m.title}</h3>
                        <p className="text-[13px]" style={{ color: "var(--ink-light)" }}>{m.desc}</p>
                      </div>
                      {mode === m.id && <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[11px] font-bold" style={{ background: m.color }}>✓</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4 — Review & Begin ═══ */}
            {step === 4 && (
              <motion.div key="s4" className="p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-[24px] font-extrabold tracking-tight mb-1" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                  All Set!
                </h2>
                <p className="text-[14px] mb-6" style={{ color: "var(--ink-light)" }}>Here&apos;s your summary. Your AI schedule will generate automatically.</p>
                <div className="space-y-2 mb-6">
                  {[
                    { label: "Exam", value: examType, icon: <GraduationCap size={14} strokeWidth={1.5} /> },
                    { label: "Date", value: examDate ? new Date(examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—", icon: <Calendar size={14} strokeWidth={1.5} /> },
                    ...(focusSubjects.length > 0 ? [{ label: "Subjects", value: focusSubjects.join(", "), icon: <Atom size={14} strokeWidth={1.5} /> }] : []),
                    { label: "WhatsApp", value: studentPhone, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg> },
                    { label: "Parent", value: parentPhone, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#7BA65B"><circle cx="12" cy="8" r="4" stroke="#7BA65B" strokeWidth="1.5" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7BA65B" strokeWidth="1.5" fill="none"/></svg> },
                    mode ? { label: "Mode", value: MODES.find(m => m.id === mode)!.title, icon: MODES.find(m => m.id === mode)! && (() => { const Im = MODES.find(m => m.id === mode)!; return <Im.Icon size={14} strokeWidth={1.5} />; })() } : { label: "Mode", value: "—", icon: null },
                  ].filter(Boolean).map((item, i) => {
                    if (!item) return null;
                    return (
                      <div key={i} className="flex justify-between items-center py-3 px-4 rounded-xl" style={{ background: "#F4EEDB", border: "1px solid var(--border)" }}>
                        <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "var(--ink-muted)" }}>
                          {item.icon}{item.label}
                        </span>
                        <span className="text-[13px] font-semibold text-right max-w-[60%]" style={{ color: "var(--earthy)" }}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                    Schedule Preferences (Optional)
                  </label>
                  <textarea
                    placeholder="e.g. I prefer studying in the morning. Keep Sundays for rest..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-[14px] border text-[13px] outline-none transition-all resize-none"
                    style={{ borderColor: "rgba(91,70,54,0.12)", background: "#F4EEDB", color: "var(--earthy)" }}
                  />
                </div>
                <div className="p-4 rounded-2xl mb-4" style={{ background: "rgba(123,166,91,0.04)", border: "1px solid rgba(123,166,91,0.1)" }}>
                  <p className="text-[13px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--moss)" }}>
                    <Sparkles size={14} /> AI will generate your schedule
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--ink-light)" }}>Your personalized study plan appears on your dashboard after you begin.</p>
                </div>
                {error && <p className="text-[12px] mb-3 text-center" style={{ color: "#DC2626" }}>{error}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting || generatingSchedule}
                  className="btn-mustard w-full text-[15px] py-4 disabled:opacity-50 flex items-center justify-center gap-2">
                  {generatingSchedule ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating AI Schedule...</>
                  ) : isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finalizing Setup...</>
                  ) : (
                    <><Sparkles size={18} /> Begin Your Journey</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex justify-between items-center flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)", background: "#F4EEDB" }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-[14px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[rgba(91,70,54,0.05)]"
              style={{ color: "var(--ink-light)" }}><ArrowLeft size={16} /> Back</button>
          ) : (
            <button onClick={onDismiss} className="text-[13px] px-5 py-2.5 rounded-xl hover:bg-[rgba(91,70,54,0.05)]"
              style={{ color: "var(--ink-muted)" }}>Finish later</button>
          )}
          {step < stepsCount ? (
            <button onClick={() => setStep(s => s + 1)} disabled={nextDisabled}
              className="btn-moss text-[14px] py-3 px-8 disabled:opacity-40 flex items-center gap-1.5">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </motion.div>
    </div>
  );
}
