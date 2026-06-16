"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import ReactCountryFlag from "react-country-flag";
import CountryPicker from "@/components/CountryPicker";
import GuruMascot from "@/components/illustrations/GuruMascot";
import { ArrowRight, Check, Moon, Sun, Zap, Flame, Plus, X, Sparkles } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

interface Props { onComplete: () => void; onDismiss: () => void; getToken: () => Promise<string | null>; }

const MISSIONS = [ { id:"nda", title:"Crack NDA", emoji:"🎖", color:"#5B4636" }, { id:"jee", title:"Clear JEE", emoji:"⚙", color:"#0F2167" }, { id:"neet", title:"Clear NEET", emoji:"🧪", color:"#7BA65B" }, { id:"upsc", title:"Clear UPSC", emoji:"🏛", color:"#DC2626" }, { id:"school", title:"Ace School", emoji:"📚", color:"#1CB0F6" }, { id:"custom", title:"My Goal", emoji:"🎯", color:"#58CC02" } ];

const IDENTITIES = [ { id:"morning", title:"Morning Warrior", icon:<Sun size={28}/>, desc:"I crush goals before breakfast", color:"#D9A441" }, { id:"night", title:"Night Owl", icon:<Moon size={28}/>, desc:"My brain activates after sunset", color:"#78A6D8" }, { id:"flexible", title:"Flexible Learner", icon:<Zap size={28}/>, desc:"I adapt to the day", color:"#58CC02" }, { id:"grinder", title:"Disciplined Grinder", icon:<Flame size={28}/>, desc:"I push through anything", color:"#FF7A00" } ];

const SUBJECTS = [ { id:"physics", label:"Physics", icon:"💎", color:"#0F2167" }, { id:"chemistry", label:"Chemistry", icon:"🧪", color:"#7BA65B" }, { id:"maths", label:"Math", icon:"🔢", color:"#DC2626" }, { id:"biology", label:"Biology", icon:"🌿", color:"#58CC02" }, { id:"history", label:"History", icon:"📜", color:"#D9A441" }, { id:"english", label:"English", icon:"✍️", color:"#1CB0F6" }, { id:"cs", label:"CS", icon:"💻", color:"#0F2167" }, { id:"econ", label:"Econ", icon:"📊", color:"#FF7A00" } ];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const totalSteps = 6;

export default function CinematicOnboarding({ onComplete, onDismiss, getToken }: Props) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("IN");
  const [dialCode, setDialCode] = useState("+91");
  const [showPicker, setShowPicker] = useState(false);
  const [mission, setMission] = useState("");
  const [examDate, setExamDate] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [identity, setIdentity] = useState("");
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [customSubs, setCustomSubs] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [mode] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const selectedCountry = COUNTRIES.find(c=>c.code===country) || COUNTRIES[COUNTRIES.length-1];
  const exams = MISSIONS; 

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".scene-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(".progress-fill", { width: `${((step)/totalSteps)*100}%` }, { width: `${((step+1)/totalSteps)*100}%`, duration: 0.6, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, [step]);

  const goTo = (n: number) => setStep(n);

  const handleSubmit = async () => {
    setSubmitting(true); setGenStep(1);
    let schedule = null;
    const token = await getToken();
    try {
      const r = await fetch(`${API_BASE}/api/v1/generate-schedule`, {
        method:"POST", headers:{"Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{})},
        body:JSON.stringify({ exam_type:mission, focus_subjects:[...selectedSubs,...customSubs].join(", "), user_prompt:`Identity: ${identity}` }),
      });
      if (r.ok) { const d = await r.json(); if (d.success) schedule = d.schedule; }
    } catch {}
    setGenStep(2);
    const profile = { country, country_code:country, isd_code:dialCode, exam_type:mission, exam_date:examDate||null, focus_subjects:[...selectedSubs,...customSubs].join(", "), mode, preferred_channel:"whatsapp", channel_handle:whatsapp||null, schedule_locked:false, setup_complete:true, schedule_data:schedule };
    localStorage.setItem("wmg_profile", JSON.stringify(profile));
    try { await fetch(`${API_BASE}/api/v1/onboarding/setup`, { method:"POST", headers:{"Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{})}, body:JSON.stringify(profile) }); } catch {}
    setGenStep(3);
    setTimeout(() => { setSubmitting(false); onComplete(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden" style={{ background: "#F4EEDB" }}>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[5%] w-80 h-80 rounded-full blur-3xl opacity-[0.04]" style={{ background: "radial-gradient(circle, #7BA65B 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[10%] w-72 h-72 rounded-full blur-3xl opacity-[0.03]" style={{ background: "radial-gradient(circle, #D9A441 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <img src="/watchmeguru.png" alt="WatchMeGuru" className="h-10 w-auto object-contain" />
        <button onClick={onDismiss} className="text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)]" style={{color:"#9B8E84"}}>Skip for now</button>
      </div>

      <div className="relative z-10 px-6 pb-2">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{color:"#9B8E84"}}>
            {submitting ? "Building your world" : `Step ${step+1}/${totalSteps}`}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}>
            <div className="progress-fill h-full rounded-full" style={{background:"linear-gradient(90deg, #58CC02, #7BA65B)", width:`${((step+1)/totalSteps)*100}%`, transition:"width 0.6s ease"}}/>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-6">
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
          <div key={step} className="scene-content w-full max-w-lg">
          
          {step===0&&<div className="flex flex-col items-center text-center">
            <span className="text-[56px] mb-4">🌍</span>
            <h1 className="text-[28px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Where are you from?</h1>
            <p className="text-[14px] font-medium mb-6 max-w-sm" style={{color:"#6B5D52"}}>Choose your country so your mentor understands your education system.</p>
            <button onClick={()=>setShowPicker(true)} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-[15px] font-semibold transition-all hover:border-[#58CC02]/40 mb-4" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}>
              <ReactCountryFlag countryCode={country} svg style={{width:24,height:18,borderRadius:3}}/>
              {selectedCountry.name} <span className="text-[#9B8E84] ml-auto">{dialCode}</span>
            </button>
            <button onClick={()=>goTo(1)} className="btn-moss w-full text-[15px] py-3">Continue <ArrowRight size={16}/></button>
          </div>}

          {step===1&&<div className="flex flex-col items-center text-center">
            <h2 className="text-[26px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>What are we helping you become?</h2>
            <p className="text-[13px] font-medium mb-5" style={{color:"#6B5D52"}}>Choose your mission — or create your own.</p>
            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              {exams.map(m=><motion.div key={m.id} onClick={()=>{setMission(m.id);goTo(2)}} className="cursor-pointer p-5 rounded-3xl text-center border-2 transition-all relative group" style={{background:"#FDF9F0",borderColor:mission===m.id?m.color:"rgba(0,0,0,0.05)",boxShadow:mission===m.id?`0 0 24px ${m.color}15`:""}} whileHover={{scale:1.03,y:-4,boxShadow:`0 12px 32px ${m.color}12`}}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" style={{background:`radial-gradient(circle at center, ${m.color}06 0%, transparent 70%)`}}/>
                <span className="text-[36px] block mb-2 relative z-10">{m.emoji}</span>
                <h3 className="text-[15px] font-extrabold relative z-10" style={{color:mission===m.id?m.color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>{m.title}</h3>
              </motion.div>)}
            </div>
            <input placeholder="Or type your own goal..." className="w-full px-4 py-3 rounded-xl border text-[13px] outline-none text-center" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}
              onChange={(e)=>{if(e.target.value){setMission("custom");setExamDate(e.target.value)}}}
              onKeyDown={(e)=>{if(e.key==="Enter"&&mission==="custom")goTo(2)}}/>
          </div>}

          {step===2&&<div className="flex flex-col items-center text-center">
            <h2 className="text-[26px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>When do you shine?</h2>
            <p className="text-[13px] font-medium mb-5" style={{color:"#6B5D52"}}>This helps time your sessions perfectly.</p>
            <div className="space-y-3 w-full">
              {IDENTITIES.map(id=><motion.div key={id.id} onClick={()=>{setIdentity(id.id);goTo(3)}} className="cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all" style={{borderColor:identity===id.id?id.color:"rgba(0,0,0,0.06)",background:identity===id.id?`${id.color}06`:"#FDF9F0"}} whileHover={{scale:1.02,y:-2}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${id.color}12`,color:id.color}}>{id.icon}</div>
                <div className="flex-1 text-left"><h3 className="text-[15px] font-extrabold" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>{id.title}</h3><p className="text-[12px] font-medium" style={{color:"#6B5D52"}}>{id.desc}</p></div>
                {identity===id.id&&<Check size={20} style={{color:id.color}}/>}
              </motion.div>)}
            </div>
          </div>}

          {step===3&&<div className="flex flex-col items-center text-center">
            <span className="text-[64px] mb-4">🦉</span>
            <h2 className="text-[26px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Meet your mentor</h2>
            <p className="text-[13px] font-medium mb-5 max-w-sm" style={{color:"#6B5D52"}}>I'm Guru. I'll check in on WhatsApp every day — even when motivation fades.</p>
            <div className="w-full flex gap-2 mb-6">
              <button onClick={()=>setShowPicker(true)} className="w-24 flex-shrink-0 px-3 py-4 rounded-2xl border text-[14px] font-semibold flex items-center gap-1" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}>{dialCode} ▾</button>
              <input type="tel" placeholder="98765 43210" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} className="flex-1 px-4 py-4 rounded-2xl border text-[15px] outline-none" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}/>
            </div>
            <button onClick={()=>goTo(4)} className="btn-moss text-[15px] py-3 px-8">Continue <ArrowRight size={16}/></button>
          </div>}

          {step===4&&<div className="flex flex-col items-center text-center">
            <h2 className="text-[26px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>What will grow your tree?</h2>
            <p className="text-[13px] font-medium mb-5" style={{color:"#6B5D52"}}>Each subject becomes part of your ecosystem.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {SUBJECTS.map(s=>{const sel=selectedSubs.includes(s.id);return(
                <button key={s.id} onClick={()=>sel?setSelectedSubs(p=>p.filter(x=>x!==s.id)):setSelectedSubs(p=>[...p,s.id])}
                  className="px-3 py-2 rounded-full text-[12px] font-bold border transition-all" style={{borderColor:sel?s.color:"rgba(0,0,0,0.08)",background:sel?`${s.color}10`:"#FDF9F0",color:sel?s.color:"#3D2E24"}}>{sel?"✓ ":""}{s.label}</button>
              )})}
            </div>
            <div className="flex gap-2 w-full mb-2">
              <input placeholder="Add custom subject..." value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&customInput.trim()){setCustomSubs(p=>[...p,customInput.trim()]);setCustomInput("")}}} className="flex-1 px-4 py-2.5 rounded-xl border text-[13px] outline-none" style={{borderColor:"rgba(0,0,0,0.08)",background:"#FDF9F0"}}/>
              <button onClick={()=>{if(customInput.trim()){setCustomSubs(p=>[...p,customInput.trim()]);setCustomInput("")}}} className="btn-moss text-[13px] py-2.5 px-4"><Plus size={14}/></button>
            </div>
            {customSubs.length>0&&<div className="flex flex-wrap gap-2 mb-4">{customSubs.map(s=><span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold" style={{background:"rgba(88,204,2,0.06)",color:"#58CC02",border:"1px solid rgba(88,204,2,0.12)"}}>{s}<X size={13} className="cursor-pointer hover:text-[#DC2626]" onClick={()=>setCustomSubs(p=>p.filter(x=>x!==s))}/></span>)}</div>}
            <button onClick={()=>goTo(5)} disabled={selectedSubs.length===0&&customSubs.length===0} className="btn-moss w-full text-[15px] py-3 disabled:opacity-40">Continue <ArrowRight size={16}/></button>
          </div>}

          {step===5&&<div className="flex flex-col items-center text-center">
            <div className="text-[56px] mb-4">{exams.find(m=>m.id===mission)?.emoji||"🎯"}</div>
            <h2 className="text-[26px] font-extrabold mb-2" style={{color:"#3D2E24",fontFamily:"var(--font-baloo)"}}>Your world is ready</h2>
            <div className="w-full space-y-2 mb-6 text-left">
              {[{l:"Country",v:<span className="flex items-center gap-1.5"><ReactCountryFlag countryCode={country} svg style={{width:16,height:12,borderRadius:2}}/>{selectedCountry.name}</span>},{l:"Mission",v:exams.find(m=>m.id===mission)?.title||"Custom"},{l:"Identity",v:IDENTITIES.find(i=>i.id===identity)?.title},{l:"Subjects",v:[...selectedSubs.map(s=>SUBJECTS.find(x=>x.id===s)?.label),...customSubs].filter(Boolean).join(", ")||"None"}].map(r=>
                <div key={r.l} className="flex justify-between py-2.5 px-4 rounded-xl" style={{background:"#FDF9F0",border:"1px solid rgba(0,0,0,0.04)"}}><span className="text-[11px] font-bold uppercase" style={{color:"#9B8E84"}}>{r.l}</span><span className="text-[13px] font-semibold" style={{color:"#3D2E24"}}>{r.v}</span></div>
              )}
            </div>
            <button onClick={handleSubmit} className="btn-mustard w-full text-[16px] py-4 flex items-center justify-center gap-2">
              <Sparkles size={18}/> Start My Journey
            </button>
          </div>}
          </div>
          )}
        </AnimatePresence>
      </div>

      {showPicker&&<CountryPicker selected={country} onSelect={(code, dial)=>{setCountry(code);setDialCode(dial);setShowPicker(false)}} onClose={()=>setShowPicker(false)}/>}

      {!submitting && step>0 && (
        <div className="relative z-10 px-6 pb-4">
          <button onClick={()=>goTo(step-1)} className="text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-[rgba(0,0,0,0.04)]" style={{color:"#6B5D52"}}>← Back</button>
        </div>
      )}
    </div>
  );
}
