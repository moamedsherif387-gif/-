/**
 * Generative romantic soundscape and interaction audio using the Web Audio API.
 * Completely client-side, zero external assets, pristine and dependable.
 */

class RomanticAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private melodyInterval: number | null = null;
  private isMelodyRunning: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle bell / harp note (frequency in Hz, duration in seconds)
  public playTone(freq: number, duration: number = 0.6, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Smooth attack and gentle exponential decay
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Keypad click chime
  public playKeypadChime(index: number) {
    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51];
    const freq = scale[index % scale.length];
    this.playTone(freq, 0.4, 'sine', 0.12);
  }

  // Unlock triumph chord
  public playUnlockChord() {
    if (this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C Major 9
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 1.2, 'triangle', 0.14);
      }, idx * 100);
    });
  }

  // Error dull thud
  public playErrorChime() {
    this.playTone(180, 0.35, 'sawtooth', 0.08);
  }

  // Reveal climax majestic harp glissando
  public playGrandRevealSound() {
    if (this.isMuted) return;
    const notes = [
      392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98
    ];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 1.5, 'sine', 0.18);
      }, i * 90);
    });
  }

  // Ambient romantic piano/harp generator
  public startAmbientMelody() {
    if (this.isMelodyRunning || this.isMuted) return;
    this.isMelodyRunning = true;

    // Progression of romantic ambient notes (Pentatonic / Lydian ethereal mode)
    const romanticProgression = [
      [261.63, 329.63, 392.00, 523.25], // C
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 261.63, 329.63, 392.00], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G
    ];

    let step = 0;
    this.melodyInterval = window.setInterval(() => {
      if (this.isMuted || !this.isMelodyRunning) return;
      const chord = romanticProgression[step % romanticProgression.length];
      chord.forEach((note, nIdx) => {
        setTimeout(() => {
          this.playTone(note * 1.5, 2.2, 'sine', 0.05);
        }, nIdx * 250);
      });
      step++;
    }, 3200);
  }

  public stopAmbientMelody() {
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    this.isMelodyRunning = false;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbientMelody();
    } else {
      this.startAmbientMelody();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const romanticAudio = new RomanticAudio();
