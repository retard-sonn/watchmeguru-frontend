"use client";
import { motion } from "motion/react";
import Link from "next/link";
import StreakFire from "@/components/illustrations/StreakFire";
import XPMeter from "@/components/illustrations/XPMeter";
import MissionCard from "@/components/illustrations/MissionCard";
import Ornament from "@/components/illustrations/Ornament";

const MISSIONS = [
  { label: "Physics — Kinematics revision", time: "Today · 2:00 PM" },
  { label: "Solve 10 NEET bio questions", time: "Today · 5:30 PM" },
  { label: "Mock quiz: Organic Chemistry", time: "Tomorrow · 9:00 AM" },
];

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COMPLETED = [true, true, true, true, false, false, false];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-28 px-6" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Ornament variant="dots" />
          </div>
          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(32px, 4.5vw, 50px)",
              color: "var(--earthy)",
            }}
          >
            Today&apos;s Mission
            <span style={{ color: "var(--moss)" }}> Dashboard</span>
          </h2>
          <p className="text-[16px] max-w-md mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Your productivity world evolves as you complete missions.
          </p>
        </motion.div>

        {/* Dashboard game board */}
        <motion.div
          className="card-terrain p-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Top row: Streak + XP + Kickstart */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Streak counter */}
            <motion.div
              className="card-earthy p-6 flex flex-col items-center text-center"
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mb-3">
                <StreakFire streak={14} />
              </div>
              <div
                className="text-[12px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "var(--ink-muted)" }}
              >
                Streak
              </div>
              <div
                className="text-[32px] font-extrabold leading-none"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                14
              </div>
              <div className="text-[12px] font-medium" style={{ color: "var(--moss)" }}>
                days
              </div>
            </motion.div>

            {/* XP Meter */}
            <motion.div
              className="card-earthy p-6 flex flex-col items-center text-center"
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mb-3">
                <XPMeter progress={0.65} />
              </div>
              <div
                className="text-[12px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "var(--ink-muted)" }}
              >
                XP Earned
              </div>
              <div
                className="text-[32px] font-extrabold leading-none"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                2,430
              </div>
              <div className="text-[12px] font-medium" style={{ color: "var(--moss)" }}>
                / 3,750 to next level
              </div>
            </motion.div>

            {/* Kickstart button */}
            <motion.div
              className="card-earthy p-6 flex flex-col items-center justify-center text-center"
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ background: "linear-gradient(145deg, #FDF9F0 0%, #FFF8E0 100%)" }}
            >
              <motion.div
                className="mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #D9A441, #C08A2E)",
                    boxShadow: "0 8px 32px rgba(217,164,65,0.35)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4L18 12L6 20V4Z" fill="#FDF9F0" />
                  </svg>
                </div>
              </motion.div>
              <div
                className="text-[16px] font-bold mb-1"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                Kickstart Session
              </div>
              <div className="text-[13px] font-medium" style={{ color: "var(--ink-light)" }}>
                Mentor ready
              </div>
            </motion.div>
          </div>

          {/* Middle: Missions + Calendar */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission list */}
            <div className="space-y-3">
              <h4
                className="text-[14px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--ink-muted)" }}
              >
                Active Missions
              </h4>
              {MISSIONS.map((m, i) => (
                <MissionCard key={m.label} label={m.label} time={m.time} delayed={i * 0.1} />
              ))}
            </div>

            {/* Weekly calendar */}
            <div>
              <h4
                className="text-[14px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--ink-muted)" }}
              >
                This Week
              </h4>
              <div className="card-earthy p-5">
                <div className="flex justify-between mb-3">
                  {WEEK.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                        {day}
                      </span>
                      <motion.div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                        style={{
                          background: COMPLETED[i]
                            ? "linear-gradient(135deg, #7BA65B, #5F8C3E)"
                            : "rgba(91,70,54,0.05)",
                        }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, type: "spring" }}
                      >
                        {COMPLETED[i] ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7L5.5 9.5L11 4" stroke="#FDF9F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(91,70,54,0.2)" }} />
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--moss)" }}>
                    4/7 days completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom links */}
          <div className="mt-8 pt-6 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
            <Link href="/sign-up" className="btn-moss">
              Start Your World →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
