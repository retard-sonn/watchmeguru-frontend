"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { useQueryClient } from "@tanstack/react-query";
import CinematicOnboarding from "./components/CinematicOnboarding";
import DashboardNav from "./components/DashboardNav";
import IntegrationsDrawer from "./components/IntegrationsDrawer";
import UnlockFlow from "./components/UnlockFlow";
import ProgressionPath from "./components/ProgressionPath";
import AchievementCabinet from "./components/AchievementCabinet";
import Leaderboard from "./components/Leaderboard";
import AchievementUnlock from "./components/AchievementUnlock";
import TopicPopup from "./components/TopicPopup";
import CelebrationModal from "./components/CelebrationModal";
import LevelUpModal from "./components/LevelUpModal";
import InteractiveMascot from "@/components/InteractiveMascot";
import { XPPopupProvider, useXPPopup } from "./components/XPPopup";
import { useSparkles } from "@/components/SparkleBurst";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";
import GrowthWorld from "@/components/GrowthWorld";
import { Flame, Zap, Play, Clock, Sparkles, Shield } from "lucide-react";
import { useStudentProfile, useTodayTasks, useTodaySchedule, useCompleteTask } from "@/hooks/useDashboard";
import MissionBoard from "./components/MissionBoard";

function getSavedProfile(): Record<string, unknown> | null {
  try { const r = localStorage.getItem("wmg_profile"); return r ? JSON.parse(r) : null; } catch { return null; }
}
const LVS: Record<number, string> = { 1:"Seedling",3:"Sprout",5:"Sapling",8:"Tree",12:"Forest",20:"Mountain",30:"Constellation" };
function lvName(l: number) { let b = "Seedling"; for (const [k, v] of Object.entries(LVS)) { if (l >= parseInt(k)) b = v; } return b; }

// Check if a mission is within its scheduled time window
function isMissionActive(startTime: string | undefined): boolean {
  if (!startTime) return true; // No time set = always active
  const m = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return true;
  let h = parseInt(m[1]); const min = parseInt(m[2]); const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  const now = new Date();
  return (now.getHours() * 60 + now.getMinutes()) >= (h * 60 + min);
}

function timeUntil(startTime: string | undefined): string {
  if (!startTime) return "";
  const m = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return "";
  let h = parseInt(m[1]); const min = parseInt(m[2]); const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  const now = new Date(); const target = h * 60 + min; const current = now.getHours() * 60 + now.getMinutes();
  if (current >= target) return "";
  const diff = target - current;
  if (diff >= 60) return `Starts at ${startTime}`;
  return `Starts in ${diff} min`;
}

export default function DashboardPage() {
  const { user } = useUser(); const { getToken } = useAuth(); const queryClient = useQueryClient();
  const [showWizard, setShowWizard] = useState(false); const [showUnlock, setShowUnlock] = useState(false);
  const [wizardOpenedOnce, setWizardOpenedOnce] = useState(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const [mounted, setMounted] = useState(false); const prevLevelRef = useRef(1);
  const [topicPopup, setTopicPopup] = useState<{isOpen:boolean; subject:string; index:number}|null>(null);
  const [showAchievementUnlock, setShowAchievementUnlock] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<{index:number; startTime:number; elapsed:number}|null>(null);
  const [celebration, setCelebration] = useState<{isOpen:boolean;title:string;subtitle:string;description:string;type:"streak"|"mission"|"general"|"level_up"|"daily_goal";statValue?:string|number}>({isOpen:false,title:"",subtitle:"",description:"",type:"general"});
  const [levelUp, setLevelUp] = useState<{isOpen:boolean;newLevel:number;levelTitle:string;previousTitle?:string}>({isOpen:false,newLevel:1,levelTitle:"Seedling"});

  useEffect(() => { setMounted(true); if (typeof window !== "undefined") setWizardDismissed(sessionStorage.getItem("wmg_wizard_dismissed")==="true"); }, []);

  const { data: profile } = useStudentProfile();
  const backendHasSetup = profile?.setup_complete === true;
  const savedProfile = !backendHasSetup ? getSavedProfile() : null;
  const hasSetup = backendHasSetup || (savedProfile?.setup_complete === true);
  const dayStreak = profile?.day_streak || 0;
  const tasksCompleted = profile?.tasks_completed || 0;
  const studyHours = profile?.study_hours || 0;
  const quizAccuracy = profile?.quiz_accuracy || 0;
  const xp = tasksCompleted * 50 + studyHours * 30 + dayStreak * 10;
  const level = Math.floor(xp / 500) + 1;
  const studentName = user?.firstName || profile?.name || (savedProfile?.name as string) || "Student";
  const { data: todayData } = useTodaySchedule();
  const completeTask = useCompleteTask();
  const schedule = todayData?.blocks || [];
  const examType = mounted ? ((profile?.exam_type as string) || (savedProfile?.exam_type as string) || "") : "";
  const computeDaysToExam = (): number|null => { if (!mounted) return null; const raw = profile?.exam_date||(savedProfile?.exam_date as string); if (!raw) return null; const d = new Date(raw); if (isNaN(d.getTime())) return null; return Math.max(0, Math.ceil((d.getTime()-Date.now())/86400000)); };
  const daysToExam = computeDaysToExam();

  useEffect(() => { if (profile && level>prevLevelRef.current) { setLevelUp({isOpen:true,newLevel:level,levelTitle:lvName(level),previousTitle:lvName(prevLevelRef.current)}); } prevLevelRef.current = level; }, [level,profile]);
  useEffect(() => { if (mounted && !hasSetup && !wizardOpenedOnce && !wizardDismissed) { const t = setTimeout(()=>{setShowWizard(true);setWizardOpenedOnce(true)},1000); return ()=>clearTimeout(t); } }, [mounted,hasSetup,wizardOpenedOnce,wizardDismissed]);

  const handleMilestone = useCallback((event: {type:string;xp?:number;feedback?:string}) => {
    if (event.type === "first_session") {
      setCelebration({isOpen:true,title:"First Mission Accomplished! 🎉",subtitle:`+${event.xp||50} XP Earned`,description:"You've officially started growing your learning ecosystem. Every expert was once a beginner.",type:"mission",statValue:event.xp});
    } else if (event.type === "all_done") {
      setCelebration({isOpen:true,title:"Perfect Day! 🌟",subtitle:`+${event.xp||100} XP Bonus`,description:"You completed every mission today. Your ecosystem is thriving. Now rest and recover — champions sleep too.",type:"daily_goal",statValue:event.xp});
    } else if (event.type === "proof_verified") {
      setCelebration({isOpen:true,title:"Proof Verified! ✓",subtitle:`+${event.xp||50} XP — Gemini confirms your work`,description:event.feedback||"Your study evidence has been authenticated by AI vision.",type:"general",statValue:event.xp});
    } else if (event.type === "proof_partial") {
      setCelebration({isOpen:true,title:"Partial Credit",subtitle:`+${event.xp||20} XP`,description:event.feedback||"Some study evidence detected. Upload clearer proof next time for full XP.",type:"general",statValue:event.xp});
    }
  }, []);

  // Active session timer
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => { setActiveSession(p => p ? {...p, elapsed: Math.floor((Date.now()-p.startTime)/1000)} : null); }, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.index]);

  const handleSetupComplete = useCallback(() => { setShowWizard(false); ["studentProfile","todaySchedule","todayTasks"].forEach(k=>queryClient.invalidateQueries({queryKey:[k]})); }, [queryClient]);

  const handleStartMission = useCallback((index: number, subject: string) => {
    setTopicPopup({ isOpen: true, subject, index });
  }, []);

  const handleTopicConfirm = useCallback(async (topic: string, subtopic?: string) => {
    if (!topicPopup) return;
    setTopicPopup(null);
    const token = await getToken();
    const B = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      await fetch(`${B}/api/v1/kickstart/${topicPopup.index}`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({topic,subtopic}) });
      queryClient.invalidateQueries({queryKey:["studentProfile"]});
      queryClient.invalidateQueries({queryKey:["todayTasks"]});
      setActiveSession({ index: topicPopup.index, startTime: Date.now(), elapsed: 0 });
    } catch(e) { console.warn(e); }
  }, [topicPopup, getToken, queryClient]);

  const formatTime = (s: number) => { const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec.toString().padStart(2,"0")}`; };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center" style={{background:"#F4EEDB"}}><div className="w-10 h-10 rounded-full border-3 border-moss border-t-transparent animate-spin"/></div>;

  return (
    <XPPopupProvider>
      <div className="min-h-screen overflow-x-hidden" style={{background:"#F4EEDB"}} suppressHydrationWarning>
        <DashboardNav onSetup={()=>setShowWizard(true)} onUnlock={()=>setShowUnlock(true)} hasSetup={!!hasSetup} scheduleLocked={false} hasWhatsapp={!!profile?.whatsapp_number} hasDiscord={!!profile?.discord_user_id} hasTelegram={!!profile?.telegram_chat_id}/>

        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-[80px] pb-6 flex flex-col lg:flex-row gap-6">
          {/* LEFT — Identity Panel */}
          <div className="lg:w-[340px] flex-shrink-0 space-y-4">
            <motion.div className="rounded-3xl p-6 text-center" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
              style={{background:"linear-gradient(170deg, #FDFDFC 0%, #F8FAF5 100%)",border:"1.5px solid rgba(123,166,91,0.1)",boxShadow:"0 2px 20px rgba(0,0,0,0.03)"}}>
              <div className="flex justify-center mb-3 group cursor-pointer" onClick={(e) => { e.stopPropagation(); /* sparkle burst handled by mascot */ }}>
                <motion.div whileTap={{scale:0.9}} whileHover={{scale:1.05}}><InteractiveMascot size={180}/></motion.div>
              </div>
              <h2 className="text-[18px] font-extrabold mb-1" style={{fontFamily:"var(--font-baloo)",color:"#3D2E24"}}>{studentName}</h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[12px] font-extrabold" style={{background:"rgba(88,204,2,0.08)",color:"#58CC02",fontFamily:"var(--font-baloo)"}}>Lv.{level} {lvName(level)}</span>
                {dayStreak>0&&<span className="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-extrabold" style={{background:"rgba(255,122,0,0.08)",color:"#FF7A00"}}><Flame size={14}/> {dayStreak}d</span>}
              </div>
              <p className="text-[12px] font-medium mb-4" style={{color:"#6B5D52"}}>{dayStreak===0?"Your ecosystem is sleeping. Start a session.":dayStreak<3?"Your world is waking up.":"Your ecosystem is thriving."}</p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1"><Zap size={13} style={{color:"#FFC800"}}/><span className="text-[11px] font-bold uppercase text-[#9B8E84]">XP</span><span className="text-[12px] font-extrabold" style={{color:"#58CC02",fontFamily:"var(--font-baloo)"}}>{xp%500}/{500}</span></div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}><motion.div className="h-full rounded-full" style={{background:"linear-gradient(90deg,#58CC02,#7BA65B,#FFC800)",boxShadow:"0 0 8px rgba(88,204,2,0.2)"}} initial={{width:0}} animate={{width:`${Math.min((xp%500)/500*100,100)}%`}} transition={{duration:1}}/></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{v:studyHours.toFixed(1),l:"Hours"},{v:tasksCompleted,l:"Sessions"},{v:quizAccuracy,l:"Acc %"}].map(s=><div key={s.l} className="text-center p-2 rounded-xl" style={{background:"rgba(0,0,0,0.01)"}}><div className="text-[18px] font-extrabold" style={{fontFamily:"var(--font-baloo)",color:"#3D2E24"}}>{s.v}</div><div className="text-[9px] font-bold uppercase text-[#9B8E84]">{s.l}</div></div>)}
              </div>
              {examType&&daysToExam!==null&&<div className="rounded-xl p-2 mb-4" style={{background:daysToExam<=30?"rgba(255,75,75,0.04)":"rgba(88,204,2,0.03)",border:`1px solid ${daysToExam<=30?"rgba(255,75,75,0.1)":"rgba(88,204,2,0.08)"}`}}>
                <div className="text-[20px] font-extrabold" style={{fontFamily:"var(--font-baloo)",color:daysToExam<=30?"#FF4B4B":"#58CC02"}}>{daysToExam}d</div><div className="text-[10px] font-bold uppercase text-[#9B8E84]">until {examType}</div>
              </div>}
              {!hasSetup?<button onClick={()=>setShowWizard(true)} className="w-full py-3 rounded-2xl text-[14px] font-extrabold text-white" style={{background:"linear-gradient(135deg,#58CC02,#46A302)",boxShadow:"0 4px 16px rgba(88,204,2,0.3)",fontFamily:"var(--font-baloo)"}}><Sparkles size={16}/> Setup Your World</button>
              :<button onClick={()=>document.getElementById("missions")?.scrollIntoView({behavior:"smooth"})} className="w-full py-3 rounded-2xl text-[14px] font-extrabold text-white" style={{background:"linear-gradient(135deg,#58CC02,#46A302)",boxShadow:"0 4px 16px rgba(88,204,2,0.3)",fontFamily:"var(--font-baloo)"}}><Play size={16} fill="white"/> Today's Missions</button>}
            </motion.div>
            <ProgressionPath currentLevel={level} xp={xp}/>
          </div>

          {/* RIGHT — Missions + Achievements */}
          <div className="flex-1 space-y-4" id="missions">
            {/* TODAY'S MISSIONS — MissionBoard with milestones + proof */}
            <MissionBoard
              tasks={schedule.map((b: any, i: number) => ({
                id: b.id || String(i),
                title: b.label || b.subject || `Block ${i+1}`,
                subject: b.label,
                status: b.status || "pending",
                due_date: b.due_date,
              }))}
              isLoading={false}
              onComplete={(taskId) => {
                const idx = schedule.findIndex((b: any, i: number) => (b.id || String(i)) === taskId);
                if (idx >= 0) handleStartMission(idx, schedule[idx].label);
              }}
              totalCompleted={tasksCompleted}
              onMilestone={handleMilestone}
            />

            {/* 3D Growth World */}
            <GrowthWorld level={level} streak={dayStreak} tasksCompleted={tasksCompleted||0} />

            {/* Achievement Cabinet */}
            <AchievementCabinet dayStreak={dayStreak} tasksCompleted={tasksCompleted||0} studyHours={studyHours||0} quizAccuracy={quizAccuracy||0} level={level}/>
          </div>
        </div>

        {/* Topic Popup */}
        <TopicPopup isOpen={topicPopup?.isOpen||false} subject={topicPopup?.subject||""} onConfirm={handleTopicConfirm} onCancel={()=>setTopicPopup(null)}/>

        {/* Achievement Unlock */}
        <AchievementUnlock isOpen={showAchievementUnlock!==null} onClose={()=>setShowAchievementUnlock(null)} achievement={showAchievementUnlock}/>

        {/* Modals */}
        {showWizard&&<CinematicOnboarding onComplete={handleSetupComplete} onDismiss={()=>{setShowWizard(false);sessionStorage.setItem("wmg_wizard_dismissed","true");setWizardDismissed(true)}} getToken={getToken}/>}
        <UnlockFlow open={showUnlock} onClose={()=>setShowUnlock(false)} onUnlocked={()=>queryClient.invalidateQueries({queryKey:["studentProfile"]})}/>
        <CelebrationModal isOpen={celebration.isOpen} onClose={()=>setCelebration(p=>({...p,isOpen:false}))} title={celebration.title} subtitle={celebration.subtitle} description={celebration.description} type={celebration.type}/>
        <LevelUpModal isOpen={levelUp.isOpen} onClose={()=>setLevelUp(p=>({...p,isOpen:false}))} newLevel={levelUp.newLevel} levelTitle={levelUp.levelTitle} previousTitle={levelUp.previousTitle}/>
      </div>
    </XPPopupProvider>
  );
}
