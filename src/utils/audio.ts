// Lightweight Web Audio API synthesizer for playful educational feedback

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

export function playSound(type: 'tap' | 'pop' | 'success' | 'bounce' | 'sparkle' | 'complete' | 'fanfare'): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'tap': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'bounce': {
        // Boing/spring sound for incorrect placement
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.08);
        osc.frequency.linearRampToValueAtTime(200, now + 0.16);
        osc.frequency.linearRampToValueAtTime(130, now + 0.28);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
        break;
      }

      case 'sparkle':
      case 'success': {
        // High melodic chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);
          gain.gain.setValueAtTime(0.18, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 0.25);
        });
        break;
      }

      case 'complete':
      case 'fanfare': {
        // Traditional celebration melody (Do - Mi - Sol - High Do - Sol - High Do)
        const fanfareNotes = [
          { f: 523.25, d: 0.12 },
          { f: 659.25, d: 0.12 },
          { f: 783.99, d: 0.14 },
          { f: 1046.5, d: 0.35 }
        ];
        let offset = 0;
        fanfareNotes.forEach((n) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + offset;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, noteStart);
          gain.gain.setValueAtTime(0.22, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + n.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + n.d);
          offset += n.d * 0.85;
        });
        break;
      }
    }
  } catch (err) {
    console.debug('Audio play inhibited:', err);
  }
}
