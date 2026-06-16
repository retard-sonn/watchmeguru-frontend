import { Howl } from 'howler';

// Simple base64 audio fallbacks to prevent errors if files are missing, 
// using tiny minimal chimes/pops generated for testing.
// In a production app, you would replace these URLs with paths to actual MP3s in public/sounds/

// A tiny 'pop' sound
const popSound = 'data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExEAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

// A tiny 'chime' sound 
const chimeSound = 'data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExEAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

// A tiny 'whoosh' sound
const whooshSound = 'data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExEAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';


export const sounds = {
  pop: new Howl({ src: ['/sounds/pop.mp3', popSound], volume: 0.5 }),
  chime: new Howl({ src: ['/sounds/chime.mp3', chimeSound], volume: 0.5 }),
  whoosh: new Howl({ src: ['/sounds/whoosh.mp3', whooshSound], volume: 0.3 }),
  levelUp: new Howl({ src: ['/sounds/levelup.mp3', chimeSound], volume: 0.6 }),
  streakFire: new Howl({ src: ['/sounds/fire.mp3', whooshSound], volume: 0.4, loop: false }),
};

// Global mute state (muted by default per autoplay policies)
let isMuted = true;

Object.values(sounds).forEach(sound => sound.mute(isMuted));

export const toggleMute = () => {
  isMuted = !isMuted;
  Object.values(sounds).forEach(sound => sound.mute(isMuted));
  return isMuted;
};

export const getMuteState = () => isMuted;

export const playSound = (soundName: keyof typeof sounds) => {
  if (!isMuted && sounds[soundName]) {
    sounds[soundName].play();
  }
};
