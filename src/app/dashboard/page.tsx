"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { useQueryClient } from "@tanstack/react-query";
import SetupWizard from "./components/SetupWizard";
import DashboardNav from "./components/DashboardNav";
import IntegrationsDrawer from "./components/IntegrationsDrawer";
import UnlockFlow from "./components/UnlockFlow";
import ProgressionPath from "./components/ProgressionPath";
import AchievementCabinet from "./components/AchievementCabinet";
import Leaderboard from "./components/Leaderboard";
import AchievementUnlock from "./components/AchievementUnlock";
import TopicPopup from "./components/TopicPopup";
import CelebrationModal from "./components/CelebrationModal";
import InteractiveMascot from "@/components/InteractiveMascot";
import { XP_LEVELS, getLevelFromXP, getProgressToNext } from "@/lib/levelSystem";
import { XPPopupProvider, useXPPopup } from "./components/XPPopup";
import { useSparkles } from "@/components/SparkleBurst";
import { getSubjectIcon } from "@/components/illustrations/SubjectIcons";
import GrowthWorld from "@/components/GrowthWorld";
import { Flame, Zap, Play, Clock, Sparkles, Shield } from "lucide-react";
import { useStudentProfile, useTodayTasks, useTodaySchedule, useCompleteTask, useAuditLog } from "@/hooks/useDashboard";
import MissionBoard from "./components/MissionBoard";
import ActiveSessionTimer from "./components/ActiveSessionTimer";
import LightningReview from "./components/LightningReview";

function getSavedProfile(): Record<string, unknown> | null {
  try { const r = localStorage.getItem("wmg_profile"); return r ? JSON.parse(r) : null; } catch { return null; }
}

export default function DashboardPage() {
  const { user } = useUser(); const { getToken } = useAuth(); const queryClient = useQueryClient();
  const { logEvent } = useAuditLog();
  const [showWizard, setShowWizard] = useState(false); const [showUnlock, setShowUnlock] = useState(false);
  const [wizardOpenedOnce, setWizardOpenedOnce] = useState(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [topicPopup, setTopicPopup] = useState<{isOpen:boolean; subject:string; index:number}|null>(null);
  const [activeSession, setActiveSession] = useState<{index:number; subject:string; durationSeconds:number; startTime:number}|null>(null);
  const [lightningReview, setLightningReview] = useState<{isOpen:boolean; subject:string; earnedXP:number; taskId:string}|null>(null);
  const [celebration, setCelebration] = useState<{isOpen:boolean;title:string;subtitle:string;description:string;type:"streak"|"mission"|"general"|"level_up"|"daily_goal"|"accuracy"|"comeback"|"error"|"cancelled";statValue?:string|number}>({isOpen:false,title:"",subtitle:"",description:"",type:"general"});
  
  const [showLevelUnlock, setShowLevelUnlock] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const prevLevelRef = useRef(1);

  useEffect(() => { 
    setMounted(true); 
    if (typeof window !== "undefined") {
      setWizardDismissed(sessionStorage.getItem("wmg_wizard_dismissed")==="true");
      const savedLevel = parseInt(localStorage.getItem("wmg_last_level") || "1");
      prevLevelRef.current = savedLevel;
    }
  }, []);

  const { data: profile } = useStudentProfile();
  const backendHasSetup = profile?.setup_complete === true;
  const savedProfile = !backendHasSetup ? getSavedProfile() : null;
  const hasSetup = backendHasSetup || (savedProfile?.setup_complete === true);
  const dayStreak = profile?.day_streak || 0;
  const tasksCompleted = profile?.tasks_completed || 0;
  const studyHours = profile?.study_hours || 0;
  const quizAccuracy = profile?.quiz_accuracy || 0;
  
  // New Granular Level System
  const rawXp = Math.round(studyHours * 50) + dayStreak * 10;
  const levelInfo = getLevelFromXP(rawXp);
  const level = levelInfo.level;
  const levelTitle = levelInfo.title;
  const { percentage: xpProgress, nextLevelXP } = getProgressToNext(rawXp);

  const studentName = user?.firstName || profile?.name || (savedProfile?.name as string) || "Student";
  const { data: todayData } = useTodaySchedule();
  const completeTask = useCompleteTask();
  const schedule = todayData?.blocks || [];
  const examType = mounted ? ((profile?.exam_type as string) || (savedProfile?.exam_type as string) || "") : "";
  const computeDaysToExam = (): number|null => { if (!mounted) return null; const raw = profile?.exam_date||(savedProfile?.exam_date as string); if (!raw) return null; const d = new Date(raw); if (isNaN(d.getTime())) return null; return Math.max(0, Math.ceil((d.getTime()-Date.now())/86400000)); };
  const daysToExam = computeDaysToExam();

  // Level Up Detection
  useEffect(() => {
    if (mounted && level > prevLevelRef.current) {
      setShowLevelUnlock(true);
      localStorage.setItem("wmg_last_level", level.toString());
      prevLevelRef.current = level;
    }
  }, [level, mounted]);

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

  const handleEndSession = useCallback((elapsedSeconds: number, earnedXP: number) => {
    if (!activeSession) return;
    const taskId = schedule[activeSession.index]?.id || String(activeSession.index);
    logEvent("SESSION_ENDED", { index: activeSession.index, subject: activeSession.subject, elapsedSeconds, earnedXP });
    
    if (elapsedSeconds < 60) {
      setCelebration({
        isOpen: true,
        title: "Session Cancelled",
        subtitle: "+0 XP",
        description: "You ended the session before 1 minute passed. No XP awarded, and the mission remains incomplete.",
        type: "error"
      });
      setActiveSession(null);
      return;
    }

    setLightningReview({ isOpen: true, subject: activeSession.subject, earnedXP, taskId });
    setActiveSession(null);
  }, [activeSession, schedule, logEvent]);

  const handleLightningComplete = useCallback(async (success: boolean, finalXP: number, skipped: boolean = false) => {
    if (!lightningReview) return;
    const { taskId, subject } = lightningReview;
    setLightningReview(null);
    logEvent("LIGHTNING_REVIEW_COMPLETED", { subject, success, finalXP, skipped });
    
    if (success) {
      completeTask.mutate({ taskId, success, hours: Math.max(0.1, finalXP / 50) }, {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey:["studentProfile"]});
          queryClient.refetchQueries({queryKey:["studentProfile"]});
        }
      });

      setCelebration({
        isOpen: true,
        title: skipped ? "Session Logged ✓" : "Session Verified! ⚡",
        subtitle: `+${finalXP} XP Earned`,
        description: skipped 
          ? `Your session for ${subject} has been saved.`
          : `You successfully crushed the Lightning Review for ${subject}. Your ecosystem is thriving!`,
        type: "mission",
        statValue: finalXP
      });
    } else {
      setCelebration({
        isOpen: true,
        title: "Session Unverified 😔",
        subtitle: "+0 XP",
        description: `You didn't pass the Lightning Review for ${subject}. Stay focused next time!`,
        type: "cancelled"
      });
    }
  }, [lightningReview, completeTask, logEvent]);

  const handleSetupComplete = useCallback(() => { 
    setShowWizard(false); 
    ["studentProfile","todaySchedule","todayTasks"].forEach(k => {
      queryClient.invalidateQueries({queryKey:[k]});
      queryClient.refetchQueries({queryKey:[k]});
    }); 
  }, [queryClient]);

  const handleStartMission = useCallback((index: number, subject: string) => {
    logEvent("SUBJECT_POPUP_OPENED", { index, subject });
    setTopicPopup({ isOpen: true, subject, index });
  }, [logEvent]);

  const handleTopicConfirm = useCallback(async (topic: string, subtopic?: string) => {
    if (!topicPopup) return;
    const { index, subject } = topicPopup;
    setTopicPopup(null);
    logEvent("SUBJECT_SELECTED", { index, subject, topic, subtopic });
    
    // Optimistic UI update: instantly show timer
    const blockHours = schedule[index]?.hours || 1;
    const startTimeStr = schedule[index]?.startTime || schedule[index]?.start;
    
    let durationSecs = Math.round(blockHours * 3600);
    
    if (startTimeStr) {
      const m = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (m) {
        let h = parseInt(m[1], 10);
        if (m[3] && m[3].toUpperCase() === "PM" && h !== 12) h += 12;
        if (m[3] && m[3].toUpperCase() === "AM" && h === 12) h = 0;
        
        const now = new Date();
        const startMinutes = h * 60 + parseInt(m[2], 10);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const endMinutes = startMinutes + Math.round(blockHours * 60);
        
        if (currentMinutes > startMinutes && currentMinutes < endMinutes) {
          const remainingMinutes = endMinutes - currentMinutes;
          durationSecs = Math.max(60, (remainingMinutes * 60) - now.getSeconds());
        }
      }
    }

    setActiveSession({ index, subject, durationSeconds: durationSecs, startTime: Date.now() });

    const token = await getToken();
    const B = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      await fetch(`${B}/api/v1/kickstart/${index}`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({topic,subtopic}) });
      queryClient.invalidateQueries({queryKey:["studentProfile"]});
      queryClient.invalidateQueries({queryKey:["todayTasks"]});
    } catch(e) { console.warn(e); }
  }, [topicPopup, getToken, queryClient, logEvent, schedule]);

  const handleTopicCancel = useCallback(() => {
    if (topicPopup) {
      logEvent("SUBJECT_CANCELLED", { index: topicPopup.index, subject: topicPopup.subject });
    }
    setTopicPopup(null);
  }, [topicPopup, logEvent]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center" style={{background:"#F4EEDB"}}><div className="w-10 h-10 rounded-full border-3 border-moss border-t-transparent animate-spin"/></div>;

  return (
    <XPPopupProvider>
      <div className="min-h-screen" style={{background:"#F4EEDB"}} suppressHydrationWarning>
        <DashboardNav onSetup={()=>setShowWizard(true)} onUnlock={()=>setShowUnlock(true)} onOpenLeaderboard={()=>setShowLeaderboard(true)} hasSetup={!!hasSetup} scheduleLocked={false} hasWhatsapp={!!profile?.whatsapp_number} hasDiscord={!!profile?.discord_user_id} hasTelegram={!!profile?.telegram_chat_id}/>

        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-[80px] pb-24 flex flex-col lg:flex-row gap-6">
          {/* LEFT — Identity Panel */}
          <div className="lg:w-[340px] flex-shrink-0 space-y-4">
            <motion.div className="rounded-3xl p-6 text-center" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
              style={{background:"linear-gradient(170deg, #FDFDFC 0%, #F8FAF5 100%)",border:"1.5px solid rgba(123,166,91,0.1)",boxShadow:"0 2px 20px rgba(0,0,0,0.03)"}}>
              <div className="flex justify-center mb-3 group cursor-pointer">
                <motion.div whileTap={{scale:0.9}} whileHover={{scale:1.05}}><InteractiveMascot size={180}/></motion.div>
              </div>
              <h2 className="text-[18px] font-extrabold mb-1" style={{fontFamily:"var(--font-baloo)",color:"#3D2E24"}}>{studentName}</h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[12px] font-extrabold" style={{background:`${levelInfo.color}10`, color:levelInfo.color, fontFamily:"var(--font-baloo)"}}>Lv.{level} {levelTitle}</span>
                {dayStreak>0&&<span className="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-extrabold" style={{background:"rgba(255,122,0,0.08)",color:"#FF7A00"}}><Flame size={14}/> {dayStreak}d</span>}
              </div>
              <p className="text-[12px] font-medium mb-4" style={{color:"#6B5D52"}}>{dayStreak===0?"Your ecosystem is sleeping. Start a session.":dayStreak<3?"Your world is waking up.":"Your ecosystem is thriving."}</p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1"><Zap size={13} style={{color:"#FFC800"}}/><span className="text-[11px] font-bold uppercase text-[#9B8E84]">XP</span><span className="text-[12px] font-extrabold" style={{color:levelInfo.color, fontFamily:"var(--font-baloo)"}}>{Math.round(rawXp)}/{nextLevelXP}</span></div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.04)"}}><motion.div className="h-full rounded-full" style={{background:levelInfo.color, boxShadow:`0 0 8px ${levelInfo.color}40`}} initial={{width:0}} animate={{width:`${xpProgress}%`}} transition={{duration:1}}/></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{v:studyHours.toFixed(1),l:"Hours"},{v:tasksCompleted,l:"Sessions"},{v:quizAccuracy,l:"Acc %"}].map(s=><div key={s.l} className="text-center p-2 rounded-xl" style={{background:"rgba(0,0,0,0.01)"}}><div className="text-[18px] font-extrabold" style={{fontFamily:"var(--font-baloo)",color:"#3D2E24"}}>{s.v}</div><div className="text-[9px] font-bold uppercase text-[#9B8E84]">{s.l}</div></div>)}
              </div>
              {!hasSetup?<button onClick={()=>setShowWizard(true)} className="w-full py-3 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#58CC02,#46A302)",boxShadow:"0 4px 16px rgba(88,204,2,0.3)",fontFamily:"var(--font-baloo)"}}><Sparkles size={16}/> Setup Your World</button>
              :<button onClick={()=>document.getElementById("missions")?.scrollIntoView({behavior:"smooth"})} className="w-full py-3 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#58CC02,#46A302)",boxShadow:"0 4px 16px rgba(88,204,2,0.3)",fontFamily:"var(--font-baloo)"}}><Play size={14} fill="white" className="ml-0.5"/> Today's Missions</button>}
              </motion.div>
              <ProgressionPath currentLevel={level} xp={rawXp}/>
            </div>

            {/* RIGHT — Missions + Achievements */}
            <div className="flex-1 space-y-4" id="missions">
              {activeSession ? (
                <ActiveSessionTimer 
                  subject={activeSession.subject} 
                  durationSeconds={activeSession.durationSeconds} 
                  startTime={activeSession.startTime}
                  onEndSession={handleEndSession}
                />
              ) : (
                <MissionBoard
                  tasks={schedule.map((b: any, i: number) => ({
                    id: b.id || String(i),
                    title: b.label || b.subject || `Block ${i+1}`,
                    subject: b.label || b.subject,
                    start_time: b.startTime || b.start,
                    hours: b.hours || 1,
                    status: b.status || "pending",
                    due_date: b.due_date,
                  }))}
                  isLoading={false}
                  onStart={(taskId) => {
                    const idx = schedule.findIndex((b: any, i: number) => (b.id || String(i)) === taskId);
                    if (idx >= 0) handleStartMission(idx, schedule[idx].label);
                  }}
                  onComplete={() => {}}
                  totalCompleted={tasksCompleted}
                  onMilestone={handleMilestone}
                />
              )}

            <GrowthWorld level={level} streak={dayStreak} tasksCompleted={tasksCompleted||0} />
            <AchievementCabinet dayStreak={dayStreak} tasksCompleted={tasksCompleted||0} studyHours={studyHours||0} quizAccuracy={quizAccuracy||0} level={level}/>
          </div>
        </div>

        <Leaderboard countryCode={profile?.country} isOpen={showLeaderboard} onClose={()=>setShowLeaderboard(false)} />

        <TopicPopup isOpen={topicPopup?.isOpen||false} subject={topicPopup?.subject||""} onConfirm={handleTopicConfirm} onCancel={handleTopicCancel}/>

        {/* Modals */}
        <AchievementUnlock 
          isOpen={showLevelUnlock} 
          onClose={() => setShowLevelUnlock(false)} 
          levelInfo={levelInfo}
          previousTitle={XP_LEVELS.find(l => l.level === level - 1)?.title}
        />
        {lightningReview?.isOpen && (
          <LightningReview 
            subject={lightningReview.subject} 
            earnedXP={lightningReview.earnedXP} 
            taskId={lightningReview.taskId} 
            onComplete={handleLightningComplete} 
          />
        )}
        {showWizard&&<SetupWizard onComplete={handleSetupComplete} onDismiss={()=>{setShowWizard(false);sessionStorage.setItem("wmg_wizard_dismissed","true");setWizardDismissed(true)}} getToken={getToken} initialProfile={profile}/>}
        <UnlockFlow open={showUnlock} onClose={()=>setShowUnlock(false)} onUnlocked={()=>queryClient.invalidateQueries({queryKey:["studentProfile"]})}/>
        <CelebrationModal isOpen={celebration.isOpen} onClose={()=>setCelebration(p=>({...p,isOpen:false}))} title={celebration.title} subtitle={celebration.subtitle} description={celebration.description} type={celebration.type}/>
        </div>
        </XPPopupProvider>
        );
        }

