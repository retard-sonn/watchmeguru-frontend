"use client";

// Lightweight Web Audio API sound system — no external files needed
// Generates tones programmatically for dopamine feedback
// Muted by default, user must enable

let audioCtx: AudioContext | null = null;
let _muted = true;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  if (_muted) return;
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {}
}

export const sounds = {
  xp: () => { playTone(880, 0.1, "sine", 0.06); setTimeout(() => playTone(1100, 0.1, "sine", 0.06), 80); },
  achievement: () => {
    playTone(660, 0.15, "triangle", 0.07);
    setTimeout(() => playTone(880, 0.12, "triangle", 0.07), 150);
    setTimeout(() => playTone(1100, 0.2, "triangle", 0.07), 300);
  },
  levelUp: () => {
    [440, 550, 660, 880, 1100].forEach((f, i) => { setTimeout(() => playTone(f, 0.15, "sine", 0.06), i * 100); });
  },
  streak: () => { playTone(330, 0.3, "sawtooth", 0.04); playTone(660, 0.3, "sawtooth", 0.03); },
  click: () => { playTone(600, 0.05, "sine", 0.03); },
  start: () => { playTone(440, 0.15, "square", 0.04); setTimeout(() => playTone(660, 0.1, "square", 0.04), 100); },

  mute() { _muted = true; },
  unmute() { _muted = false; },
  get muted() { return _muted; },
};
