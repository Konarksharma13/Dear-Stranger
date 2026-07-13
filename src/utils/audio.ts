/**
 * Synthesizes a soft, realistic paper-turn rustling swish using the Web Audio API.
 * This runs client-side dynamically without loading external MP3 files.
 */
export function playPageTurnSound() {
  if (typeof window === 'undefined') return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    // Create a 0.4 second buffer for noise
    const duration = 0.4;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate pink-ish/filtered noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Simple filter to brown/pink noise to make it less harsh than white noise
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    // Bandpass filter to target the rustle frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);
    
    // Soft sweep frequency down as the page finishes turning
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + duration);
    
    // Gain envelope (fade-in, sustain, exponential fade-out)
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.06); // soft swish volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    // Connect nodes
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    // Play
    source.start();
    source.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Web Audio page turn play skipped or blocked by browser policies.", e);
  }
}
