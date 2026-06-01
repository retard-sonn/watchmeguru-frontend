"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";

interface AIInsightCardProps {
  studentName: string;
  dayStreak: number;
  studyHours: number;
  tasksCompleted: number;
  quizAccuracy: number;
  examType?: string;
  daysToExam?: number | null;
}

interface Insight {
  emoji: string;
  text: string;
  color: string;
  bg: string;
}

function generateInsight(props: AIInsightCardProps): Insight {
  const { studentName, dayStreak, studyHours, tasksCompleted, quizAccuracy, examType, daysToExam } = props;
  const hour = new Date().getHours();

  // Streak-based insights
  if (dayStreak >= 7) {
    return {
      emoji: "🔥",
      text: `${studentName}, your ${dayStreak}-day streak is impressive! You're in the top tier of consistent learners. Keep this energy going.`,
      color: "#D9A441",
      bg: "rgba(217,164,65,0.06)",
    };
  }
  if (dayStreak >= 3) {
    return {
      emoji: "⚡",
      text: `Three days strong, ${studentName}! Research shows consistency compounds — you're building neural pathways that make studying easier.`,
      color: "#58CC02",
      bg: "rgba(88,204,2,0.06)",
    };
  }

  // Productivity-based
  if (studyHours >= 4) {
    return {
      emoji: "🚀",
      text: `You've put in ${studyHours}h today — that's elite-level consistency. Remember to take breaks between deep work sessions for maximum retention.`,
      color: "#1CB0F6",
      bg: "rgba(28,176,246,0.06)",
    };
  }

  // Tasks completed
  if (tasksCompleted >= 3) {
    return {
      emoji: "✅",
      text: `${tasksCompleted} missions done today! Each completed block is a step toward your goals. Momentum is on your side.`,
      color: "#58CC02",
      bg: "rgba(88,204,2,0.06)",
    };
  }

  // Exam countdown
  if (daysToExam !== null && daysToExam !== undefined && daysToExam <= 30) {
    return {
      emoji: "🎯",
      text: `${daysToExam} days until ${examType || "your exam"}. This is crunch time — every session counts. Focus on weak areas and mock tests.`,
      color: "#FF7A00",
      bg: "rgba(255,122,0,0.06)",
    };
  }
  if (daysToExam !== null && daysToExam !== undefined && daysToExam <= 90) {
    return {
      emoji: "📅",
      text: `About ${Math.floor(daysToExam / 30)} months to ${examType || "your exam"}. Perfect time to build a balanced routine across all subjects.`,
      color: "#1CB0F6",
      bg: "rgba(28,176,246,0.06)",
    };
  }

  // Quiz accuracy
  if (quizAccuracy >= 80 && tasksCompleted > 0) {
    return {
      emoji: "🧠",
      text: `Your quiz accuracy is ${quizAccuracy}% — that's excellent! Your study methods are working. Consider teaching concepts to solidify them.`,
      color: "#CE82FF",
      bg: "rgba(206,130,255,0.06)",
    };
  }

  // Morning motivation
  if (hour < 12) {
    return {
      emoji: "🌅",
      text: `Morning energy is a superpower, ${studentName}. Your brain is primed for deep work right now. Start with your hardest subject!`,
      color: "#D9A441",
      bg: "rgba(217,164,65,0.06)",
    };
  }

  // Evening reflection
  if (hour >= 18) {
    return {
      emoji: "🌙",
      text: `Evening sessions can be surprisingly productive, ${studentName}. A calm, focused hour now beats three distracted hours earlier.`,
      color: "#78A6D8",
      bg: "rgba(120,166,216,0.06)",
    };
  }

  // Default — first day / no data
  if (dayStreak === 0 && studyHours === 0) {
    return {
      emoji: "🌱",
      text: `Welcome, ${studentName}! Every expert was once a beginner. Start your first study block and watch your ecosystem grow from a single seed.`,
      color: "#7BA65B",
      bg: "rgba(123,166,91,0.06)",
    };
  }

  // Fallback
  return {
    emoji: "💡",
    text: `${studentName}, consistency beats intensity. Even a focused 25-minute session today keeps your learning ecosystem alive and growing.`,
    color: "#58CC02",
    bg: "rgba(88,204,2,0.06)",
  };
}

export default function AIInsightCard(props: AIInsightCardProps) {
  const [insight, setInsight] = useState<Insight>(() => generateInsight(props));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setInsight(generateInsight(props));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dayStreak, props.studyHours, props.tasksCompleted]);

  return (
    <section className="py-2" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="card-terrain p-5 flex items-start gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: insight.bg }}
          suppressHydrationWarning
        >
          {/* Lightbulb icon */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${insight.color}15` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[20px]">{insight.emoji}</span>
          </motion.div>

          {/* Insight text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb size={13} style={{ color: insight.color }} />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: insight.color }}
              >
                Smart Tip
              </span>
            </div>
            <p
              className="text-[14px] leading-relaxed font-medium"
              style={{ color: "var(--ink-light)" }}
            >
              {insight.text}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
