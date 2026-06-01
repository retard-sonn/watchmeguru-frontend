"use client";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy } from "lucide-react";
import { ConsistencyBadge, DisciplineBadge, DeepFocusBadge, NightOwlBadge, EarlyBirdBadge } from "@/components/illustrations/AchievementBadges";
import gsap from "gsap";

interface Achievement { id:string; label:string; Badge:any; unlocked:boolean; rarity:"common"|"rare"|"epic"|"legendary"; desc:string; color:string; }

const RARITY = {
  common:    { label:"Common",    color:"#9B8E84", glow:"rgba(155,142,132,0.2)", bg:"rgba(155,142,132,0.03)" },
  rare:      { label:"Rare",      color:"#1CB0F6", glow:"rgba(28,176,246,0.3)",  bg:"rgba(28,176,246,0.04)" },
  epic:      { label:"Epic",      color:"#CE82FF", glow:"rgba(206,130,255,0.35)", bg:"rgba(206,130,255,0.04)" },
  legendary: { label:"Legendary", color:"#D9A441", glow:"rgba(217,164,65,0.4)",  bg:"rgba(217,164,65,0.05)" },
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id:"first_session", label:"First Step", Badge:ConsistencyBadge, unlocked:false, rarity:"common",    desc:"Complete your first session", color:"#58CC02" },
  { id:"streak_3",      label:"3-Day Flame", Badge:ConsistencyBadge, unlocked:false, rarity:"rare",     desc:"Study 3 days in a row", color:"#1CB0F6" },
  { id:"streak_7",      label:"Weekly Warrior", Badge:DisciplineBadge, unlocked:false, rarity:"epic",   desc:"7 days unbroken", color:"#CE82FF" },
  { id:"streak_30",     label:"30-Day Legend", Badge:DisciplineBadge, unlocked:false, rarity:"legendary", desc:"30 day streak", color:"#D9A441" },
  { id:"hours_10",      label:"10 Hour Club", Badge:DeepFocusBadge, unlocked:false, rarity:"rare",      desc:"10 study hours", color:"#1CB0F6" },
  { id:"hours_50",      label:"50 Hours", Badge:DeepFocusBadge, unlocked:false, rarity:"epic",           desc:"50 study hours", color:"#CE82FF" },
  { id:"tasks_5",       label:"Task Slayer", Badge:EarlyBirdBadge, unlocked:false, rarity:"common",      desc:"Complete 5 tasks", color:"#58CC02" },
  { id:"tasks_25",      label:"25 Tasks", Badge:EarlyBirdBadge, unlocked:false, rarity:"rare",           desc:"Complete 25 tasks", color:"#1CB0F6" },
  { id:"accuracy_80",   label:"Sharp Mind", Badge:NightOwlBadge, unlocked:false, rarity:"epic",          desc:"80% quiz accuracy", color:"#78A6D8" },
  { id:"level_10",      label:"Level 10", Badge:NightOwlBadge, unlocked:false, rarity:"legendary",       desc:"Reach Level 10", color:"#D9A441" },
];

interface Props { dayStreak:number; tasksCompleted:number; studyHours:number; quizAccuracy:number; level:number; }

export default function AchievementCabinet({ dayStreak, tasksCompleted, studyHours, quizAccuracy, level }: Props) {
  const [showUnlock, setShowUnlock] = useState<string|null>(null);

  const achievements = ALL_ACHIEVEMENTS.map(a=>({...a,unlocked:
    (a.id==="first_session"&&tasksCompleted>=1)||(a.id==="streak_3"&&dayStreak>=3)||(a.id==="streak_7"&&dayStreak>=7)||
    (a.id==="streak_30"&&dayStreak>=30)||(a.id==="hours_10"&&studyHours>=10)||(a.id==="hours_50"&&studyHours>=50)||
    (a.id==="tasks_5"&&tasksCompleted>=5)||(a.id==="tasks_25"&&tasksCompleted>=25)||
    (a.id==="accuracy_80"&&quizAccuracy>=80)||(a.id==="level_10"&&level>=10)}));
  const count = achievements.filter(a=>a.unlocked).length;

  // GSAP pulse on newly unlocked
  useEffect(() => {
    achievements.forEach(a => {
      if (a.unlocked && !localStorage.getItem(`cab_${a.id}`)) {
        localStorage.setItem(`cab_${a.id}`,"true");
        setShowUnlock(a.id);
        setTimeout(()=>setShowUnlock(null), 3000);
      }
    });
  }, [dayStreak, tasksCompleted, studyHours]);

  return (
    <div className="rounded-2xl p-5" style={{ border:"1.5px solid rgba(0,0,0,0.04)", background:"rgba(0,0,0,0.01)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-extrabold" style={{ color:"#3D2E24", fontFamily:"var(--font-baloo)" }}>Achievement Cabinet</h3>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:"rgba(88,204,2,0.06)" }}>
          <Trophy size={14} style={{ color:"#58CC02" }}/>
          <span className="text-[12px] font-extrabold" style={{ color:"#58CC02", fontFamily:"var(--font-baloo)" }}>{count}/{ALL_ACHIEVEMENTS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {achievements.map(a => {
          const r = RARITY[a.rarity];
          return (
            <motion.div key={a.id}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl relative cursor-pointer transition-all"
              style={{
                background: a.unlocked ? r.bg : "transparent",
                border: `1px solid ${a.unlocked ? `${r.color}20` : "rgba(0,0,0,0.03)"}`,
                opacity: a.unlocked ? 1 : 0.35,
              }}
              whileHover={a.unlocked ? { scale:1.08, y:-3, boxShadow:`0 8px 24px ${r.glow}` } : {}}
              onClick={() => { if (a.unlocked) setShowUnlock(showUnlock===a.id?null:a.id); }}>
              {/* Rarity glow */}
              {a.unlocked && <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background:`radial-gradient(circle at center, ${r.glow} 0%, transparent 70%)` }}/>}
              <div className="relative z-10"><a.Badge size={56} unlocked={a.unlocked}/></div>
              <span className="text-[10px] font-extrabold text-center leading-tight relative z-10"
                style={{ color:a.unlocked?"#3D2E24":"#9B8E84", fontFamily:"var(--font-baloo)" }}>{a.label}</span>
              {a.unlocked && <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full relative z-10"
                style={{ background: `${r.color}15`, color:r.color }}>{r.label}</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Unlock celebration */}
      <AnimatePresence>
        {showUnlock && achievements.find(a=>a.id===showUnlock)?.unlocked && (()=>{const a=achievements.find(x=>x.id===showUnlock)!;const r=RARITY[a.rarity];return(
          <motion.div className="mt-4 p-4 rounded-xl flex items-center gap-3" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{ background:`linear-gradient(135deg, ${r.color}10, ${r.color}05)`, border:`1px solid ${r.color}20` }}>
            <Sparkles size={18} style={{color:r.color}}/>
            <div><p className="text-[13px] font-extrabold" style={{color:r.color,fontFamily:"var(--font-baloo)"}}>{a.label} Unlocked!</p><p className="text-[10px] font-medium" style={{color:"#6B5D52"}}>{a.desc} — {r.label} tier</p></div>
          </motion.div>
        )})()}
      </AnimatePresence>
    </div>
  );
}
