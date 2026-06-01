"use client";
import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Target } from "lucide-react";

interface ExamUrgencyProps {
  examType: string;
  daysToExam: number | null;
  studyHours: number;
  goalHours: number;
}

export default function ExamUrgency({ examType, daysToExam, studyHours, goalHours }: ExamUrgencyProps) {
  if (!examType || daysToExam === null || daysToExam === undefined) return null;

  const hoursGoal = goalHours || 4;
  const readiness = Math.min(Math.round((studyHours / hoursGoal) * 100), 100);
  const isUrgent = daysToExam <= 30;
  const isCritical = daysToExam <= 7;

  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isCritical
          ? "linear-gradient(135deg, rgba(255,75,75,0.06) 0%, rgba(255,122,0,0.04) 100%)"
          : isUrgent
            ? "linear-gradient(135deg, rgba(255,122,0,0.04) 0%, rgba(255,200,0,0.03) 100%)"
            : "rgba(0,0,0,0.02)",
        border: `1.5px solid ${
          isCritical ? "rgba(255,75,75,0.2)" : isUrgent ? "rgba(255,122,0,0.15)" : "rgba(0,0,0,0.06)"
        }`,
      }}
    >
      {/* Countdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-[24px]"
            animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isCritical ? "🚨" : isUrgent ? "⚠️" : "📅"}
          </motion.span>
          <div>
            <h3 className="text-[16px] font-extrabold text-[#3D2E24]" style={{ fontFamily: "var(--font-baloo)" }}>
              {daysToExam === 0 ? "Exam Day!" : `${daysToExam} Days`}
            </h3>
            <p className="text-[11px] font-semibold text-[#6B5D52]">
              until {examType}
            </p>
          </div>
        </div>

        {/* Readiness meter */}
        <div className="flex flex-col items-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{
              borderColor: readiness >= 80 ? "#58CC02" : readiness >= 50 ? "#FFC800" : "#FF4B4B",
              background: readiness >= 80
                ? "rgba(88,204,2,0.06)"
                : readiness >= 50
                  ? "rgba(255,200,0,0.06)"
                  : "rgba(255,75,75,0.06)",
            }}
          >
            <span
              className="text-[16px] font-extrabold"
              style={{
                color: readiness >= 80 ? "#58CC02" : readiness >= 50 ? "#D9A441" : "#FF4B4B",
                fontFamily: "var(--font-baloo)",
              }}
            >
              {readiness}%
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase mt-0.5 text-[#9B8E84]">Ready</span>
        </div>
      </div>

      {/* Action recommendation */}
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: isCritical ? "rgba(255,75,75,0.06)" : "rgba(88,204,2,0.04)",
          border: `1px solid ${isCritical ? "rgba(255,75,75,0.1)" : "rgba(88,204,2,0.08)"}`,
        }}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Target size={14} style={{ color: isCritical ? "#FF4B4B" : "#58CC02" }} />
        <span className="text-[12px] font-semibold text-[#3D2E24]">
          {isCritical
            ? "Crunch time — focus on mock tests and weak areas"
            : isUrgent
              ? `Study ${examType} today — every session counts`
              : "Build consistent habits — you're on track"}
        </span>
      </motion.div>
    </motion.div>
  );
}
