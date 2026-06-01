"use client";
import { useRef } from "react";
import { motion } from "motion/react";

interface Message {
  id?: string;
  time: string;
  platform?: string;
  msg: string;
  type: "inbound" | "outbound";
}

interface Props {
  interactions: Message[];
  isLoading: boolean;
}

const PLATFORM_SVG: Record<string, React.ReactNode> = {
  whatsapp: <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>,
  telegram: <svg width="13" height="13" viewBox="0 0 24 24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>,
  discord: <svg width="13" height="13" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25-1.845-.277-3.68-.277-5.487 0-.164-.394-.406-.875-.618-1.25a.077.077 0 00-.078-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.32 13.58.1 18.058a.082.082 0 00.031.056c2.053 1.507 4.041 2.423 5.993 3.03a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106c-.653-.248-1.274-.55-1.872-.892a.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.099.246.198.372.292a.077.077 0 01-.006.128 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 00-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
  dashboard: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7BA65B" strokeWidth="1.5"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>,
};

export default function MentorFeed({ interactions, isLoading }: Props) {
  const feedRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="card-terrain p-5 text-center">
        <div className="w-7 h-7 mx-auto mb-2 rounded-full border-2 border-sky border-t-transparent animate-spin" />
        <p className="text-[12px] font-medium" style={{ color: "var(--ink-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card-terrain p-5">
      <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-bold" style={{ color: "var(--earthy)", fontFamily: "var(--font-baloo)" }}>
              Mentor Messages
            </h3>
            {interactions.length > 0 && (
              <span className="text-[12px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                {interactions.length} message{interactions.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!interactions.length ? (
            <div className="text-center py-8">
              <svg viewBox="0 0 60 60" className="w-14 h-14 mx-auto mb-3 opacity-30" fill="none">
                <ellipse cx="30" cy="30" rx="10" ry="7" fill="none" stroke="#9B8E84" strokeWidth="1.5" />
                <ellipse cx="30" cy="26" rx="7" ry="5" fill="none" stroke="#9B8E84" strokeWidth="1" />
                <path d="M23,32 Q30,36 37,32" stroke="#9B8E84" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>
                Your mentor will message you once your first session starts.
              </p>
            </div>
          ) : (
            <div ref={feedRef} className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
              {interactions.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  className={`flex ${msg.type === "outbound" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === "outbound" ? "rounded-br-md" : "rounded-bl-md"}`}
                    style={{
                      background: msg.type === "outbound" ? "#FDF9F0" : "rgba(123,166,91,0.06)",
                      border: msg.type === "outbound" ? "1px solid rgba(91,70,54,0.08)" : "1px solid rgba(123,166,91,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.platform && PLATFORM_SVG[msg.platform] && (
                        <span className="flex-shrink-0">{PLATFORM_SVG[msg.platform]}</span>
                      )}
                      <span className="text-[10px] font-semibold" style={{ color: "var(--ink-muted)" }}>
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed font-medium" style={{ color: "var(--earthy)" }}>
                      {msg.msg}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
    </div>
  );
}
