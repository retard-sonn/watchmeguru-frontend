"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ArrowRight, Check, Moon, Sun, Zap, Flame, Search, Plus, X, Sparkles, Trash2, Calendar, Edit3 } from "lucide-react";
import { COUNTRIES, searchCountries } from "@/lib/countries";
import { useAuditLog } from "@/hooks/useDashboard";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";
import GuruMascot from "@/components/illustrations/GuruMascot";
import ReactCountryFlag from "react-country-flag";

interface Props { 
  onComplete: () => void; 
  onDismiss: () => void; 
  getToken: () => Promise<string | null>;
  initialProfile?: any;
}

const IDENTITIES = [
  { id:"morning", title:"Morning Warrior", icon:<Sun size={28}/>, color:"#D9A441" },
  { id:"night", title:"Night Owl", icon:<Moon size={28}/>, color:"#78A6D8" },
  { id:"flexible", title:"Flexible Learner", icon:<Zap size={28}/>, color:"#58CC02" },
  { id:"grinder", title:"Disciplined Grinder", icon:<Flame size={28}/>, color:"#FF7A00" },
];

const PRESET_SUBJECTS = [
  { id:"physics", label:"Physics", icon:"💎", color:"#0F2167" },
  { id:"chemistry", label:"Chemistry", icon:"🧪", color:"#7BA65B" },
  { id:"maths", label:"Mathematics", icon:"🔢", color:"#DC2626" },
  { id:"biology", label:"Biology", icon:"🌿", color:"#58CC02" },
  { id:"history", label:"History", icon:"📜", color:"#D9A441" },
  { id:"english", label:"English", icon:"✍️", color:"#1CB0F6" },
  { id:"geography", label:"Geography", icon:"🌍", color:"#CE82FF" },
  { id:"economics", label:"Economics", icon:"📊", color:"#FF7A00" },
  { id:"cs", label:"Computer Science", icon:"💻", color:"#0F2167" },
  { id:"business", label:"Business Studies", icon:"💼", color:"#5B4636" },
  { id:"psychology", label:"Psychology", icon:"🧠", color:"#CE82FF" },
  { id:"sociology", label:"Sociology", icon:"👥", color:"#78A6D8" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Block = { label: string; hours: number; color: string; startTime: string; start?: string; };
type DaySchedule = { day: string; fullDay: string; isRest: boolean; totalHours: number; blocks: Block[]; };

export default function SetupWizard({ onComplete, onDismiss, getToken, initialProfile }: Props) {
  // Step 0: Country, Step 1: Mission, Step 2: Mentor, Step 3: Identity, Step 4: Subjects, Step 5: Schedule, Step 6: Review
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("IN");
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [mission, setMission] = useState("");
  const [customMission, setCustomMission] = useState("");
  const [examDate, setExamDate] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [identity, setIdentity] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [customSubInput, setCustomSubInput] = useState("");
  const [mode] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [genStep, setGenStep] = useState(0);

  // Schedule states
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);
  const [scheduleType, setScheduleType] = useState<"ai" | "manual" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const { logEvent } = useAuditLog();

  const selectedCountry = COUNTRIES.find(c=>c.code===country) || COUNTRIES[0];
  const exams = selectedCountry.exams;
  const filteredCountries = searchCountries(countrySearch);

  // Load saved data
  useEffect(() => {
    let saved: any = null;
    if (initialProfile && initialProfile.setup_complete) {
      saved = initialProfile;
    } else {
      try {
        const raw = localStorage.getItem("wmg_profile");
        if (raw) saved = JSON.parse(raw);
      } catch {}
    }

    if (saved) {
      if (saved.country) { 
        setCountry(saved.country); 
        const c = COUNTRIES.find(x=>x.code===saved.country); 
        if(c) setDialCode(c.dial); 
      }
      if (saved.exam_type) setMission(saved.exam_type);
      if (saved.exam_date) setExamDate(saved.exam_date);
      
      let phone = (saved.whatsapp_number || saved.channel_handle || "").replace(/\D/g, '');
      const cCode = saved.country || country;
      const cntry = COUNTRIES.find(x => x.code === cCode);
      const dCode = (saved.isd_code || cntry?.dial || "+91").replace(/\D/g, '');
      
      if (phone.startsWith(dCode)) {
        phone = phone.slice(dCode.length);
      }
      setWhatsapp(phone);
      
      if (saved.weak_subjects && Array.isArray(saved.weak_subjects)) {
        // Just populate selected/custom based on matches
        const std = saved.weak_subjects.filter((s: string) => PRESET_SUBJECTS.some(p => p.id === s));
        const cst = saved.weak_subjects.filter((s: string) => !PRESET_SUBJECTS.some(p => p.id === s));
        setSelectedSubjects(std);
        setCustomSubjects(cst);
      }

      if (saved.daily_schedule) {
        const schedData = Array.isArray(saved.daily_schedule) ? saved.daily_schedule : saved.daily_schedule.schedule;
        if (schedData && schedData.length > 0) {
          setSchedule(schedData);
          setScheduleType(saved.schedule_type || "manual"); // fallback 
        }
      }
    }
  }, [initialProfile]);

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    setScheduleType("ai");
    logEvent("SCHEDULE_GENERATED_START", { mission: mission||customMission, identity, subjects: [...selectedSubjects,...customSubjects] });
    const token = await getToken();
    try {
      const r = await fetch(`${API_BASE}/api/v1/ai/generate-schedule`, {
        method:"POST", headers:{"Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{})},
        body:JSON.stringify({ exam_type:mission||customMission, focus_subjects:[...selectedSubjects,...customSubjects].join(", "), user_prompt:`Identity: ${identity}` }),
      });
      if (r.ok) { 
        const d = await r.json(); 
        if (d.success) {
          setSchedule(d.schedule);
          logEvent("SCHEDULE_GENERATED_SUCCESS", { days: d.schedule.length });
        } else {
          // Fallback to manual if AI fails
          initManualSchedule();
          logEvent("SCHEDULE_GENERATED_FALLBACK");
        }
      } else {
        initManualSchedule();
        logEvent("SCHEDULE_GENERATED_ERROR", { status: r.status });
      }
    } catch (e) {
      initManualSchedule();
      logEvent("SCHEDULE_GENERATED_EXCEPTION", { error: String(e) });
    }
    setGenerating(false);
  };

  const initManualSchedule = () => {
    setScheduleType("manual");
    logEvent("SCHEDULE_MANUAL_INIT");
    const empty = DAYS.map(d => ({
      day: d,
      fullDay: FULL_DAYS[d as keyof typeof FULL_DAYS],
      isRest: false,
      totalHours: 0,
      blocks: []
    }));
    setSchedule(empty);
  };

  const addBlock = (dayIdx: number) => {
    if (!schedule) return;
    const newSchedule = [...schedule];
    const day = newSchedule[dayIdx];
    const subjects = [...selectedSubjects, ...customSubjects];
    const label = subjects.length > 0 ? subjects[0] : "Study";
    const color = PRESET_SUBJECTS.find(s=>s.id===label)?.color || "#58CC02";
    
    // Estimate next start time
    let nextStart = "9:00 AM";
    if (day.blocks.length > 0) {
      const last = day.blocks[day.blocks.length-1];
      const timeStr = last.startTime || last.start || "9:00 AM";
      const parts = timeStr.split(" ");
      if (parts.length === 2) {
        const [time, period] = parts;
        const [h, m] = time.split(":").map(Number);
        let nextH = h + Math.ceil(last.hours || 1);
        let nextPeriod = period;
        if (nextH >= 12) {
          if (nextH > 12) nextH -= 12;
          if (nextH === 12) nextPeriod = period === "AM" ? "PM" : "AM";
        }
        nextStart = `${nextH}:${m.toString().padStart(2, '0')} ${nextPeriod}`;
      }
    }

    day.blocks.push({ label, hours: 2, color, startTime: nextStart, start: nextStart });
    day.totalHours = day.blocks.reduce((s, b) => s + (b.hours || 1), 0);
    setSchedule(newSchedule);
  };

  const removeBlock = (dayIdx: number, blockIdx: number) => {
    if (!schedule) return;
    const newSchedule = [...schedule];
    newSchedule[dayIdx].blocks.splice(blockIdx, 1);
    newSchedule[dayIdx].totalHours = newSchedule[dayIdx].blocks.reduce((s, b) => s + (b.hours || 1), 0);
    setSchedule(newSchedule);
  };

  const updateBlock = (dayIdx: number, blockIdx: number, field: keyof Block, value: any) => {
    if (!schedule) return;
    const newSchedule = [...schedule];
    (newSchedule[dayIdx].blocks[blockIdx] as any)[field] = value;
    if (field === 'startTime') (newSchedule[dayIdx].blocks[blockIdx] as any)['start'] = value;
    if (field === "hours") {
      newSchedule[dayIdx].totalHours = newSchedule[dayIdx].blocks.reduce((s, b) => s + (b.hours || 1), 0);
    }
    setSchedule(newSchedule);
  };

  const toggleRest = (dayIdx: number) => {
    if (!schedule) return;
    const newSchedule = [...schedule];
    newSchedule[dayIdx].isRest = !newSchedule[dayIdx].isRest;
    if (newSchedule[dayIdx].isRest) {
      newSchedule[dayIdx].blocks = [];
      newSchedule[dayIdx].totalHours = 0;
    }
    setSchedule(newSchedule);
  };

  const handleSubmit = async () => {
    setSubmitting(true); setGenStep(1);
    const token = await getToken();
    setGenStep(2);
    // Combine dial code with subscriber number for backend
    const fullNumber = dialCode + whatsapp;
    const profile = {
      country, 
      isd_code: dialCode,
      exam_type:mission||customMission, exam_date:examDate||null,
      focus_subjects:[...selectedSubjects,...customSubjects].join(", "),
      mode, preferred_channel:"whatsapp", channel_handle: fullNumber,
      schedule_locked:false, setup_complete:true, schedule_data:schedule,
    };
    localStorage.setItem("wmg_profile", JSON.stringify(profile));
    try {
      const res = await fetch(`${API_BASE}/api/v1/onboarding/setup`, { 
        method:"POST", 
        headers:{"Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{})}, 
        body:JSON.stringify(profile) 
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to save setup: ${err.detail || "Unknown error"}`);
        setSubmitting(false);
        setGenStep(0);
        return;
      }
      setGenStep(3);
      setTimeout(() => { setSubmitting(false); onComplete(); }, 2000);
    } catch (e) {
      alert("Network error. Please try again.");
      setSubmitting(false);
      setGenStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden" style={{ background: "#F4EEDB" }}>
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-96 h-96 rounded-full blur-3xl opacity-[0.06]" style={{ background: "radial-gradient(circle, #7BA65B 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-80 h-80 rounded-full blur-3xl opacity-[0.05]" style={{ background: "radial-gradient(circle, #D9A441 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <span className="text-[16px] font-extrabold" style={{ color:"#3D2E24", fontFamily:"var(--font-baloo)" }}>WatchMe<span style={{color:"#7BA65B"}}>Guru</span></span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[rgba(0,0,0,0.03)]" style={{color:"#9B8E84"}}>{submitting ? "Building" : `Step ${step+1}/7`}</span>
          <button onClick={onDismiss} className="text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)]" style={{color:"#9B8E84"}}>Skip for now</button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {submitting ? (
            <motion.div key="gen" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center">
              <span className="text-[64px] mb-4">🌱</span>
              <h2 className="text-[24px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>
                {genStep===1?"Creating your mentor...":genStep===2?"Planting your ecosystem...":"Your world is ready!"}
              </h2>
              <div className="flex gap-3 mt-4">{[1,2,3].map(i=>(<motion.div key={i} className="w-3 h-3 rounded-full" style={{background:i<=genStep?"#58CC02":"rgba(0,0,0,0.06)"}} animate={i===genStep?{scale:[1,1.4,1]}:{}} transition={{repeat:Infinity,duration:1}}/>))}</div>
            </motion.div>
          ) : (
          <>
          {/* STEP 0: Country */}
          {step===0&&<motion.div key="s0" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="w-full max-w-md">
            <h1 className="text-[28px] font-extrabold mb-2 text-center" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Where are you from?</h1>
            <p className="text-[14px] font-medium mb-6 text-center" style={{color:"#6B5D52"}}>This helps us show relevant exams and set up your experience.</p>
            <div className="relative">
              <button onClick={()=>setCountryOpen(!countryOpen)} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-[15px] font-semibold" style={{borderColor:"rgba(0,0,0,0.1)",background:"#FDF9F0"}}>
                <div className="text-[24px] flex items-center justify-center">
                  <ReactCountryFlag countryCode={selectedCountry.code} svg style={{width: '1.2em', height: '1.2em', borderRadius: '4px', overflow: 'hidden'}} />
                </div>
                {selectedCountry.name} <span className="text-[#9B8E84] ml-auto">{selectedCountry.dial}</span>
              </button>
              {countryOpen&&<div className="absolute top-full mt-2 w-full rounded-2xl border shadow-xl z-50 max-h-60 overflow-y-auto" style={{background:"#FDF9F0",borderColor:"rgba(0,0,0,0.08)"}}>
                <div className="sticky top-0 p-3 border-b" style={{background:"#FDF9F0",borderColor:"rgba(0,0,0,0.04)"}}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:"#F4EEDB"}}><Search size={14} style={{color:"#9B8E84"}}/><input autoFocus placeholder="Search country..." value={countrySearch} onChange={e=>setCountrySearch(e.target.value)} className="bg-transparent outline-none text-[13px] w-full" style={{color:"#3D2E24"}}/></div>
                </div>
                {filteredCountries.map(c=><button key={c.code} onClick={()=>{setCountry(c.code);setDialCode(c.dial);setCountryOpen(false);setCountrySearch("")}} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[rgba(0,0,0,0.02)] text-[14px] font-medium" style={{color:"#3D2E24"}}>
                  <ReactCountryFlag countryCode={c.code} svg style={{width: '1.2em', height: '1.2em', borderRadius: '3px', overflow: 'hidden'}} />
                  {c.name} <span className="ml-auto text-[#9B8E84]">{c.dial}</span>
                </button>)}
              </div>}
            </div>
            <button onClick={()=>setStep(1)} className="btn-moss w-full mt-6 text-[15px] py-3">Continue <ArrowRight size={16}/></button>
          </motion.div>}

          {/* STEP 1: Mission */}
          {step===1&&<motion.div key="s1" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="w-full max-w-3xl">
            <h2 className="text-[26px] font-extrabold mb-2 text-center" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>What are we helping you become?</h2>
            <p className="text-[14px] font-medium mb-6 text-center" style={{color:"#6B5D52"}}>Choose your mission — or create your own.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-4">
              {exams.map(m=><motion.div key={m.id} onClick={()=>{setMission(m.id);setStep(2)}} className="cursor-pointer p-4 sm:p-5 rounded-3xl text-center border-2 transition-all relative overflow-hidden group" style={{background:"#FDF9F0",borderColor:mission===m.id?m.color:"rgba(0,0,0,0.05)",boxShadow:mission===m.id?`0 0 24px ${m.color}20`:"0 2px 12px rgba(0,0,0,0.03)"}} whileHover={{scale:1.02,y:-2}}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background:`radial-gradient(circle at center, ${m.color}08 0%, transparent 70%)`}}/>
                <span className="text-[36px] block mb-2 relative z-10">{m.emoji}</span>
                <h3 className="text-[15px] font-extrabold relative z-10" style={{color:mission===m.id?m.color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>{m.title}</h3>
              </motion.div>)}
            </div>
            <div className="max-w-xs mx-auto">
              <div className="flex gap-2">
                <input placeholder="Or type your goal..." value={customMission} onChange={e=>setCustomMission(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border text-[13px] outline-none" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}/>
                <button onClick={()=>{if(customMission.trim()){setMission("");setStep(2)}}} disabled={!customMission.trim()}
                  className="btn-moss text-[13px] py-3 px-4 disabled:opacity-40"><ArrowRight size={16}/></button>
              </div>
            </div>
            <div className="max-w-xs mx-auto mt-4">
              <label className="text-[11px] font-bold uppercase tracking-widest block mb-2 text-center" style={{color:"#9B8E84"}}>Target Date (optional)</label>
              <input type="date" min={new Date().toISOString().split('T')[0]} value={examDate} onChange={e=>setExamDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none text-center" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}/>
            </div>
          </motion.div>}

          {/* STEP 2: Mentor */}
          {step===2&&<motion.div key="s2" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="flex flex-col items-center max-w-md w-full">
            <div className="mb-4">
              <GuruMascot size={64} />
            </div>
            <h2 className="text-[24px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Meet your mentor</h2>
            <p className="text-[14px] font-medium mb-6 text-center" style={{color:"#6B5D52"}}>I'll check in on WhatsApp every day.</p>
            <div className="w-full flex gap-2">
              <div className="relative w-28 flex-shrink-0">
                <button onClick={()=>{setCountryOpen(!countryOpen);setCountrySearch("")}} className="w-full px-3 py-4 rounded-2xl border text-[14px] font-semibold flex items-center gap-1" style={{borderColor:"rgba(0,0,0,0.1)",background:"#FDF9F0"}}>
                  <ReactCountryFlag countryCode={selectedCountry.code} svg style={{width: '1.2em', height: '1.2em', borderRadius: '3px', overflow: 'hidden'}} />
                  {dialCode} ▾
                </button>
                {countryOpen&&<div className="absolute top-full mt-1 w-56 rounded-xl border shadow-xl z-50 max-h-48 overflow-y-auto" style={{background:"#FDF9F0",borderColor:"rgba(0,0,0,0.08)"}}>
                  {COUNTRIES.map(c=><button key={c.code} onClick={()=>{setCountry(c.code);setDialCode(c.dial);setCountryOpen(false)}} className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-[rgba(0,0,0,0.02)] text-[13px] font-medium" style={{color:"#3D2E24"}}>
                    <ReactCountryFlag countryCode={c.code} svg style={{width: '1.2em', height: '1.2em', borderRadius: '3px', overflow: 'hidden'}} />
                    {c.name} <span className="ml-auto text-[#9B8E84]">{c.dial}</span>
                  </button>)}
                </div>}
              </div>
              <input type="tel" placeholder="9876543210" value={whatsapp} onChange={e=>setWhatsapp(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-4 py-4 rounded-2xl border text-[15px] outline-none" style={{borderColor:"rgba(0,0,0,0.1)",background:"#FDF9F0"}}/>
            </div>
            <button onClick={()=>setStep(3)} disabled={!whatsapp} className="btn-moss mt-6 text-[15px] py-3 px-8 disabled:opacity-40">Continue <ArrowRight size={16}/></button>
          </motion.div>}

          {/* STEP 3: Identity */}
          {step===3&&<motion.div key="s3" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="w-full max-w-lg">
            <h2 className="text-[24px] font-extrabold mb-2 text-center" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>When do you shine?</h2>
            <p className="text-[14px] font-medium mb-6 text-center" style={{color:"#6B5D52"}}>This helps time your sessions perfectly.</p>
            <div className="grid grid-cols-2 gap-3">
              {IDENTITIES.map(id=><motion.div key={id.id} onClick={()=>{setIdentity(id.id);setStep(4)}} className="cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all" style={{borderColor:identity===id.id?id.color:"rgba(0,0,0,0.06)",background:identity===id.id?`${id.color}06`:"#FDF9F0"}} whileHover={{scale:1.02}}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{background:`${id.color}12`,color:id.color}}>{id.icon}</div>
                <div><h3 className="text-[15px] font-extrabold" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>{id.title}</h3></div>
                {identity===id.id&&<Check size={20} className="ml-auto" style={{color:id.color}}/>}
              </motion.div>)}
            </div>
          </motion.div>}

          {/* STEP 4: Subjects */}
          {step===4&&<motion.div key="s4" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="w-full max-w-lg">
            <h2 className="text-[24px] font-extrabold mb-2 text-center" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>What will grow your tree?</h2>
            <p className="text-[14px] font-medium mb-4 text-center" style={{color:"#6B5D52"}}>Each subject becomes part of your ecosystem.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_SUBJECTS.map(s=>{const sel=selectedSubjects.includes(s.id);return(
                <button key={s.id} onClick={()=>sel?setSelectedSubjects(p=>p.filter(x=>x!==s.id)):setSelectedSubjects(p=>[...p,s.id])}
                  className="px-3 py-2 rounded-full text-[12px] font-bold border transition-all" style={{borderColor:sel?s.color:"rgba(0,0,0,0.08)",background:sel?`${s.color}10`:"#FDF9F0",color:sel?s.color:"#3D2E24"}}>{sel?"✓ ":""}{s.label}</button>
              )})}
            </div>
            <div className="flex gap-2 mb-4">
              <input placeholder="Add custom subject..." value={customSubInput} onChange={e=>setCustomSubInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&customSubInput.trim()){setCustomSubjects(p=>[...p,customSubInput.trim()]);setCustomSubInput("")}}}
                className="flex-1 px-4 py-2.5 rounded-xl border text-[13px] outline-none" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}/>
              <button onClick={()=>{if(customSubInput.trim()){setCustomSubjects(p=>[...p,customSubInput.trim()]);setCustomSubInput("")}}}
                className="btn-moss text-[13px] py-2.5 px-4 flex items-center gap-1"><Plus size={14}/> Add</button>
            </div>
            {customSubjects.length>0&&<div className="flex flex-wrap gap-2 mb-4">
              {customSubjects.map(s=><span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold" style={{background:"rgba(88,204,2,0.08)",color:"#58CC02",border:"1px solid rgba(88,204,2,0.15)"}}>{s}<X size={13} className="cursor-pointer hover:text-[#DC2626]" onClick={()=>setCustomSubjects(p=>p.filter(x=>x!==s))}/></span>)}
            </div>}
            <button onClick={()=>setStep(5)} disabled={selectedSubjects.length===0&&customSubjects.length===0}
              className="btn-moss w-full text-[15px] py-3 disabled:opacity-40">Continue <ArrowRight size={16}/></button>
          </motion.div>}

          {/* STEP 5: Schedule Crafting */}
          {step===5&&<motion.div key="s5" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="w-full max-w-4xl flex flex-col h-full max-h-[80vh]">
            {!schedule ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-[26px] font-extrabold mb-6 text-center" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>How should we craft your schedule?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  <button onClick={handleGenerateSchedule} disabled={generating} className="flex flex-col items-center p-8 rounded-3xl border-2 transition-all hover:scale-[1.02] bg-[#FDF9F0]" style={{borderColor:"#7BA65B"}}>
                    <Sparkles size={48} className="text-[#7BA65B] mb-4" />
                    <h3 className="text-[18px] font-bold mb-2">Craft with Mentor</h3>
                    <p className="text-[13px] text-[#6B5D52] text-center">Our Guru will design a balanced weekly plan based on your goals.</p>
                  </button>
                  <button onClick={initManualSchedule} className="flex flex-col items-center p-8 rounded-3xl border-2 transition-all hover:scale-[1.02] bg-[#FDF9F0]" style={{borderColor:"#D9A441"}}>
                    <Edit3 size={48} className="text-[#D9A441] mb-4" />
                    <h3 className="text-[18px] font-bold mb-2">I'll build my own</h3>
                    <p className="text-[13px] text-[#6B5D52] text-center">Prefer to take control? Manually set your study blocks from scratch.</p>
                  </button>
                </div>
                {generating && (
                  <div className="mt-8 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#7BA65B] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[14px] font-bold animate-pulse text-[#7BA65B]">Guru is thinking...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-[22px] font-extrabold" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Review your roadmap</h2>
                  <div className="flex gap-1.5 p-1 rounded-xl bg-[rgba(0,0,0,0.04)]">
                    {DAYS.map((d, i) => (
                      <button key={d} onClick={()=>setActiveDayIdx(i)} className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all" 
                        style={{background:activeDayIdx===i?"#FDF9F0":"transparent", color:activeDayIdx===i?"#3D2E24":"#9B8E84", boxShadow:activeDayIdx===i?"0 2px 8px rgba(0,0,0,0.05)":""}}>{d}</button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDF9F0] border" style={{borderColor:"rgba(0,0,0,0.05)"}}>
                    <div>
                      <h3 className="text-[16px] font-bold" style={{color:"#3D2E24"}}>{schedule[activeDayIdx].fullDay}</h3>
                      <p className="text-[12px] text-[#6B5D52]">{schedule[activeDayIdx].isRest ? "Rest day — enjoy your time!" : `${schedule[activeDayIdx].totalHours} hours of focused work`}</p>
                    </div>
                    <button onClick={()=>toggleRest(activeDayIdx)} className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${schedule[activeDayIdx].isRest ? 'bg-[#58CC02] text-white' : 'bg-[rgba(0,0,0,0.05)] text-[#6B5D52]'}`}>
                      {schedule[activeDayIdx].isRest ? "✓ Resting" : "Rest day?"}
                    </button>
                  </div>

                  {!schedule[activeDayIdx].isRest && (
                    <div className="space-y-3">
                      {schedule[activeDayIdx].blocks.map((block, bIdx) => {
                        const Icon = getSubjectIcon(block.label);
                        return (
                          <div key={bIdx} className="flex items-center gap-3 p-4 rounded-2xl bg-[#FDF9F0] border border-[rgba(0,0,0,0.04)] hover:border-[rgba(0,0,0,0.1)] transition-all">
                            <div className="w-10 h-10 flex-shrink-0 opacity-80 scale-75 origin-center">
                              <Icon />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input value={block.label} onChange={e=>updateBlock(activeDayIdx, bIdx, 'label', e.target.value)}
                                className="bg-transparent font-bold text-[14px] outline-none border-b border-transparent focus:border-[#7BA65B]/30 capitalize" />
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-[#9B8E84] uppercase">Starts:</span>
                              <input 
                                type="time" 
                                value={(() => {
                                  const raw = block.startTime || block.start || "09:00 AM";
                                  const m = raw.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                                  if (!m) return "09:00";
                                  let h = parseInt(m[1], 10);
                                  if (m[3] && m[3].toUpperCase() === "PM" && h !== 12) h += 12;
                                  if (m[3] && m[3].toUpperCase() === "AM" && h === 12) h = 0;
                                  return `${h.toString().padStart(2, '0')}:${m[2]}`;
                                })()} 
                                onChange={e=>{
                                  if (!e.target.value) return;
                                  const [h, m] = e.target.value.split(':');
                                  let hr = parseInt(h, 10);
                                  const ampm = hr >= 12 ? 'PM' : 'AM';
                                  hr = hr % 12 || 12;
                                  updateBlock(activeDayIdx, bIdx, 'startTime', `${hr}:${m.padStart(2, '0')} ${ampm}`);
                                }}
                                className="bg-transparent text-[13px] font-semibold outline-none border-b border-transparent focus:border-[#7BA65B]/30 px-1" 
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#9B8E84] uppercase">Hours:</span>
                              <input type="number" step="0.5" min="0.5" max="12" value={block.hours} onChange={e=>updateBlock(activeDayIdx, bIdx, 'hours', parseFloat(e.target.value)||0)}
                                className="bg-transparent text-[13px] font-semibold outline-none w-12 border-b border-transparent focus:border-[#7BA65B]/30" />
                            </div>
                          </div>
                          <button onClick={()=>removeBlock(activeDayIdx, bIdx)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-all">
                            <Trash2 size={16} />
                          </button>
                          </div>
                          ); })}
                          <button onClick={()=>addBlock(activeDayIdx)}
 className="w-full py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all hover:bg-[rgba(0,0,0,0.02)]" style={{borderColor:"rgba(0,0,0,0.1)",color:"#9B8E84"}}>
                        <Plus size={16} /> Add Study Block
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex-shrink-0">
                  <button onClick={()=>setStep(6)} className="btn-moss w-full text-[15px] py-4">Looks Good, Finalize <ArrowRight size={18}/></button>
                  <p className="text-center mt-3 text-[11px] text-[#9B8E84] font-medium">You can always edit this later from your dashboard.</p>
                </div>
              </div>
            )}
          </motion.div>}

          {/* STEP 6: Final Review */}
          {step===6&&<motion.div key="s6" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-30,opacity:0}} className="flex flex-col items-center max-w-sm w-full">
            <div className="text-[56px] mb-4">{exams.find(m=>m.id===mission)?.emoji||"🎯"}</div>
            <h2 className="text-[24px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Your world is ready</h2>
            <div className="w-full space-y-2 mb-6">
              {[{l:"Country",v:selectedCountry.name},{l:"Goal",v:exams.find(m=>m.id===mission)?.title||customMission||"—"},{l:"Identity",v:IDENTITIES.find(i=>i.id===identity)?.title},{l:"Subjects",v:selectedSubjects.length+"/12 selected"},{l:"Schedule",v:scheduleType==="ai"?"Guru-crafted ✨":"Custom built 🛠️"}].map(r=>
                <div key={r.l} className="flex justify-between py-2.5 px-4 rounded-xl" style={{background:"#FDF9F0",border:"1px solid rgba(0,0,0,0.04)"}}>
                  <span className="text-[11px] font-bold uppercase" style={{color:"#9B8E84"}}>{r.l}</span>
                  <span className="text-[12px] font-semibold text-right max-w-[60%]" style={{color:"#3D2E24"}}>{r.v||"—"}</span>
                </div>
              )}
            </div>
            <button onClick={handleSubmit} className="btn-mustard w-full text-[16px] py-4 flex items-center justify-center gap-2">
              Start My Journey <ArrowRight size={18}/>
            </button>
          </motion.div>}
          </>)}
        </AnimatePresence>
      </div>

      {!submitting && step>0 && (
        <div className="relative z-10 px-6 pb-4">
          <button onClick={()=>{
            if (step === 5 && schedule) { setSchedule(null); setScheduleType(null); }
            else setStep(s=>s-1);
          }} className="text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-[rgba(0,0,0,0.04)]" style={{color:"#6B5D52"}}>← Back</button>
        </div>
      )}
    </div>
  );
}
