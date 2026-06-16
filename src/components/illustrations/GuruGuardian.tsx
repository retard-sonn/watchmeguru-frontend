"use client";
import GuruMascot from "./GuruMascot";

interface Props {
  size?: number;
  state?: "idle" | "active" | "alert";
  animated?: boolean;
}

export default function GuruGuardian({ size = 160, state = "idle", animated = true }: Props) {
  // Map GuruGuardian's old states to the new GuruMascot states
  const mascotState = state === "alert" ? "thinking" : state === "active" ? "happy" : "idle";

  return (
    <div style={{ width: size, height: size }}>
      <GuruMascot size={size} state={mascotState} animated={animated} />
    </div>
  );
}
