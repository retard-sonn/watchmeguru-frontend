"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SetupWizard from "./components/SetupWizard";
import IntegrationsDrawer from "./components/IntegrationsDrawer";
import UnlockFlow from "./components/UnlockFlow";
import DashboardNav from "./components/DashboardNav";
import WorldOverview from "./components/WorldOverview";
import MissionBoard from "./components/MissionBoard";
import ScheduleTerrain from "./components/ScheduleTerrain";
import MentorFeed from "./components/MentorFeed";
import WeeklyTerrain from "./components/WeeklyTerrain";
import CelebrationModal from "./components/CelebrationModal";
import {
  useStudentProfile,
  useTodayTasks,
  useInteractions,
  useWeekActivity,
  useTodaySchedule,
  useCompleteTask,
} from "@/hooks/useDashboard";

interface Task {
  id: string;
  title: string;
  subject?: string;
  status: "pending" | "completed" | "missed" | "in_progress";
  due_date?: string;
}

function getSavedProfile(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem("wmg_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [showWizard, setShowWizard] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [wizardOpenedOnce, setWizardOpenedOnce] = useState(false);
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    description: string;
    type: "streak" | "mission" | "general";
    statValue?: string | number;
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    description: "",
    type: "general",
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setWizardDismissed(sessionStorage.getItem("wmg_wizard_dismissed") === "true");
    }
  }, []);

  const { data: profile, isLoading: profileLoading } = useStudentProfile();

  // Check both backend AND localStorage for setup status
  const backendHasSetup = profile?.setup_complete === true;
  const savedProfile = !backendHasSetup ? getSavedProfile() : null;
  const hasSetup = backendHasSetup || (savedProfile?.setup_complete === true);

  // Milestone triggers based on profile statistics
  useEffect(() => {
    if (!profile || !hasSetup) return;
    try {
      const storageKey = "wmg_celebrated_milestones";
      const raw = localStorage.getItem(storageKey);
      
      // Initialize celebrated list with current values on first run to avoid retroactive popup spam
      if (raw === null) {
        const initialCelebrated = [];
        if (profile.tasks_completed >= 1) initialCelebrated.push("first_task");
        if (profile.day_streak >= 3) initialCelebrated.push("streak_3");
        if (profile.day_streak >= 7) initialCelebrated.push("streak_7");
        localStorage.setItem(storageKey, JSON.stringify(initialCelebrated));
        return;
      }

      const celebrated = JSON.parse(raw);
      
      // Check 1: First Task Complete
      if (profile.tasks_completed >= 1 && !celebrated.includes("first_task")) {
        setCelebration({
          isOpen: true,
          title: "First Mission Accomplished!",
          subtitle: "New Milestone",
          description: "Congratulations on completing your first study session task! You've officially started growing your learning ecosystem.",
          type: "mission",
          statValue: `${profile.tasks_completed} done`,
        });
        localStorage.setItem(storageKey, JSON.stringify([...celebrated, "first_task"]));
        return;
      }
      
      // Check 2: 7-Day Streak
      if (profile.day_streak >= 7 && !celebrated.includes("streak_7")) {
        setCelebration({
          isOpen: true,
          title: "7-Day Streak Master!",
          subtitle: "Unstoppable!",
          description: "Wow! You have studied consistently for 7 days straight. You are building an incredible learning habit.",
          type: "streak",
          statValue: `${profile.day_streak} days`,
        });
        localStorage.setItem(storageKey, JSON.stringify([...celebrated, "streak_7"]));
        return;
      }

      // Check 3: 3-Day Streak
      if (profile.day_streak >= 3 && !celebrated.includes("streak_3")) {
        setCelebration({
          isOpen: true,
          title: "3-Day Streak Flame!",
          subtitle: "Sizzling!",
          description: "Three days in a row! The momentum is building. Keep the fire burning!",
          type: "streak",
          statValue: `${profile.day_streak} days`,
        });
        localStorage.setItem(storageKey, JSON.stringify([...celebrated, "streak_3"]));
        return;
      }
    } catch (e) {
      console.error("Milestone check failed:", e);
    }
  }, [profile, hasSetup]);
  const { data: todayData, isLoading: scheduleLoading } = useTodaySchedule();
  const { data: tasks, isLoading: tasksLoading } = useTodayTasks() as { data: Task[] | undefined; isLoading: boolean };
  const { data: interactions, isLoading: interactionsLoading } = useInteractions() as { data: any[] | undefined; isLoading: boolean };
  const { data: weekData, isLoading: weekLoading } = useWeekActivity() as { data: any[] | undefined; isLoading: boolean };
  const completeTask = useCompleteTask();

  // Check both backend AND localStorage for setup status
  const backendHasSetup = profile?.setup_complete === true;
  const savedProfile = !backendHasSetup ? getSavedProfile() : null;
  const hasSetup = backendHasSetup || (savedProfile?.setup_complete === true);

  const scheduleLocked = profile?.schedule_locked ?? savedProfile?.schedule_locked ?? false;
  const studentName = user?.firstName || profile?.name || (savedProfile?.name as string) || "Student";
  const dayStreak = profile?.day_streak || 0;

  const emptyStateTier: "no_setup" | "fresh" | "active" = !hasSetup ? "no_setup" : dayStreak === 0 && !tasksLoading ? "fresh" : "active";

  const computeDaysToExam = (): number | null => {
    if (!mounted) return null;
    const raw = profile?.exam_date || (savedProfile?.exam_date as string);
    if (!raw) return null;
    const examDate = new Date(raw);
    if (isNaN(examDate.getTime())) return null;
    const diff = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const daysToExam = computeDaysToExam();

  // Auto-trigger wizard ONLY if truly no setup (not even in localStorage) and hasn't been opened/dismissed yet
  useEffect(() => {
    if (!profileLoading && !hasSetup && !wizardOpenedOnce && !wizardDismissed) {
      const timer = setTimeout(() => {
        setShowWizard(true);
        setWizardOpenedOnce(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [profileLoading, hasSetup, wizardOpenedOnce, wizardDismissed]);

  const handleSetupComplete = () => {
    setShowWizard(false);
    // Refresh all data without full page reload
    queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    queryClient.invalidateQueries({ queryKey: ["todaySchedule"] });
    queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
    queryClient.invalidateQueries({ queryKey: ["interactions"] });
    queryClient.invalidateQueries({ queryKey: ["weekActivity"] });
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4EEDB" }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-5 rounded-full border-3 border-moss border-t-transparent animate-spin" />
          <p className="text-[15px] font-semibold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            Loading your world...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F4EEDB" }}>
      <DashboardNav
        onSetup={() => setShowWizard(true)}
        onUnlock={() => setShowUnlock(true)}
        hasSetup={!!hasSetup}
        scheduleLocked={scheduleLocked as boolean}
        hasWhatsapp={!!(profile?.whatsapp_number || (savedProfile?.channel_handle as string))}
        hasDiscord={!!profile?.discord_user_id}
        hasTelegram={!!profile?.telegram_chat_id}
      />

      <WorldOverview
        studentName={studentName}
        dayStreak={profile?.day_streak || 0}
        tasksCompleted={profile?.tasks_completed || 0}
        studyHours={profile?.study_hours || 0}
        quizAccuracy={profile?.quiz_accuracy || 0}
        examType={mounted ? ((profile?.exam_type as string) || (savedProfile?.exam_type as string) || "") : ""}
        daysToExam={daysToExam}
        sessionActive={false}
        missedBlocks={false}
      />

      {mounted && emptyStateTier === "fresh" && (
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="card-terrain p-10 flex flex-col items-center text-center">
              <svg viewBox="0 0 120 90" className="w-28 h-auto opacity-40 mb-4" fill="none">
                <ellipse cx="60" cy="72" rx="50" ry="8" fill="rgba(91,70,54,0.04)" />
                <ellipse cx="60" cy="66" rx="38" ry="14" fill="#EBE3C8" opacity="0.4" />
                <circle cx="60" cy="56" r="3" fill="var(--mustard)" opacity="0.4" />
                <line x1="60" y1="58" x2="60" y2="64" stroke="rgba(91,70,54,0.15)" strokeWidth="1" />
              </svg>
              <h3 className="text-[18px] font-extrabold mb-2" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                Your world is ready
              </h3>
              <p className="text-[14px] font-medium mb-6 max-w-md" style={{ color: "var(--ink-light)" }}>
                Your schedule is set. Your mentor is watching. Kickstart your first study block below to begin growing your ecosystem.
              </p>
            </div>
          </div>
        </section>
      )}

      <ScheduleTerrain
        blocks={todayData?.blocks || null}
        isLoading={scheduleLoading}
        isRest={todayData?.is_rest}
        totalHours={todayData?.total_hours}
        connectedPlatforms={[
          (profile?.whatsapp_number || (savedProfile?.channel_handle as string)) && "whatsapp",
          profile?.discord_user_id && "discord",
          profile?.telegram_chat_id && "telegram",
        ].filter(Boolean) as string[]}
      />

      <div className="grid md:grid-cols-2">
        <MissionBoard
          tasks={tasks || []}
          isLoading={tasksLoading}
          onComplete={(taskId) => completeTask.mutate(taskId)}
        />
        <MentorFeed
          interactions={interactions || []}
          isLoading={interactionsLoading}
        />
      </div>

      <WeeklyTerrain
        days={weekData || []}
        isLoading={weekLoading}
      />

      <div className="fixed bottom-6 right-6 z-40">
        <IntegrationsDrawer
          whatsappNumber={profile?.whatsapp_number || (savedProfile?.channel_handle as string) || ""}
          discordId={profile?.discord_user_id || ""}
          telegramHandle={profile?.telegram_chat_id || ""}
          guardianContact={profile?.guardian_contact || (savedProfile?.guardian_contact as string) || ""}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ["studentProfile"] })}
        />
      </div>

      {/* Setup wizard modal */}
      {showWizard && (
        <SetupWizard
          onComplete={handleSetupComplete}
          onDismiss={() => {
            setShowWizard(false);
            sessionStorage.setItem("wmg_wizard_dismissed", "true");
            setWizardDismissed(true);
          }}
          getToken={getToken}
        />
      )}

      {/* Parent OTP unlock flow */}
      <UnlockFlow
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
        onUnlocked={() => queryClient.invalidateQueries({ queryKey: ["studentProfile"] })}
      />

      {/* Milestone celebration modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        subtitle={celebration.subtitle}
        description={celebration.description}
        type={celebration.type}
        statValue={celebration.statValue}
      />
    </div>
  );
}
