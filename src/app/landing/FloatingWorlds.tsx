"use client";
import { motion } from "framer-motion";
import TerrainBlock from "@/components/illustrations/TerrainBlock";
import Ornament from "@/components/illustrations/Ornament";

const WORLDS = [
  {
    label: "Consistency",
    variant: "consistency" as const,
    desc: "Repetition creates ecosystems. Every study session adds a new layer of growth to your terrain.",
  },
  {
    label: "Focus",
    variant: "focus" as const,
    desc: "A protected sanctuary where nothing enters. The AI builds a wall between you and distractions.",
  },
  {
    label: "Momentum",
    variant: "momentum" as const,
    desc: "Once movement starts, it compounds. XP flows like rivers through connected study terrain.",
  },
  {
    label: "Deep Work",
    variant: "deepwork" as const,
    desc: "An underground chamber. A lantern-lit cocoon. The AI knows when you're truly locked in.",
  },
  {
    label: "XP System",
    variant: "xp" as const,
    desc: "Structures upgrade. Bridges unlock. Towers rise. Your civilization becomes visible as you grow.",
  },
  {
    label: "Community",
    variant: "community" as const,
    desc: "Islands connected. Signal towers blinking. Study groups strengthen ecosystems together.",
  },
];

export default function FloatingWorlds() {
  return (
    <section id="features" className="relative py-28 px-6" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Ornament variant="zigzag" />
          </div>
          <h2
            className="font-extrabold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(32px, 4.5vw, 50px)",
              color: "var(--earthy)",
            }}
          >
            Your study life is a
            <br />
            <span style={{ color: "var(--moss)" }}>growing world.</span>
          </h2>
          <p className="text-[16px] max-w-lg mx-auto font-medium" style={{ color: "var(--ink-light)" }}>
            Each habit, streak, and mission builds a distinct biome.
            Not icons — tiny living ecosystems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {WORLDS.map((world, i) => (
            <motion.div
              key={world.label}
              className="card-terrain p-6 flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-40 h-32 mb-5 relative transition-transform duration-500 group-hover:scale-110">
                <TerrainBlock variant={world.variant} />
              </div>

              <h3
                className="text-[18px] font-bold mb-2 tracking-tight"
                style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}
              >
                {world.label}
              </h3>
              <p className="text-[14px] leading-relaxed font-medium" style={{ color: "var(--ink-light)" }}>
                {world.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
