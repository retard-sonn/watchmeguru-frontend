"use client";
import { motion } from "motion/react";
import StudyTerrain from "@/components/illustrations/StudyTerrain";

interface DayActivity {
  day: string;
  hrs: number;
  tasks: number;
}

interface Props {
  days: DayActivity[];
  isLoading: boolean;
}

const DAY_LABELS: Record<string, string> = { Mon: "M", Tue: "T", Wed: "W", Thu: "T", Fri: "F", Sat: "S", Sun: "S" };
const DAY_LABELS_FULL: Record<string, string> = { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" };

export default function WeeklyTerrain({ days, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="card-terrain p-5 text-center">
        <div className="w-7 h-7 mx-auto mb-2 rounded-full border-2 border-moss border-t-transparent animate-spin" />
        <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading...</p>
      </div>
    );
  }

  const maxHrs = Math.max(...days.map((d) => d.hrs), 1);
  const totalHrs = days.reduce((s, d) => s + d.hrs, 0);
  const totalTasks = days.reduce((s, d) => s + d.tasks, 0);

  return (
    <div className="card-terrain p-5">
      <h2 className="text-[15px] font-extrabold mb-4" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
            This Week&apos;s Growth
          </h2>

          {/* Terrain bars */}
          <div className="flex justify-center gap-4 mb-6">
            {days.map((d, i) => (
              <StudyTerrain
                key={d.day}
                hours={d.hrs}
                maxHours={maxHrs}
                label={DAY_LABELS_FULL[d.day] || d.day}
                day={i}
              />
            ))}
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-10 text-center">
            <div>
              <p className="text-[20px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                {totalHrs}h
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                Total Hours
              </p>
            </div>
            <div>
              <p className="text-[20px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                {totalTasks}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                Tasks Completed
              </p>
            </div>
            <div>
              <p className="text-[20px] font-extrabold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
                {(totalHrs / 7).toFixed(1)}h
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                Avg / Day
              </p>
            </div>
      </div>
    </div>
  );
}
