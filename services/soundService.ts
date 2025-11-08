// A simple sound service using the Web Audio API to generate tones.
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Set volume with a fade-out to prevent clicking sounds
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn("Could not play sound:", error);
  }
};

export const playClickSound = () => playTone(440, 50, 'triangle');
export const playCountdownSound = () => playTone(880, 100, 'sine');
export const playGameStartSound = () => playTone(1200, 200, 'square');
export const playNextTurnSound = () => playTone(660, 150, 'sawtooth');
export const playTimeoutSound = () => playTone(220, 300, 'square');
export const playSuccessSound = () => playTone(1046.50, 100, 'triangle');
export const playUrgentAlertSound = () => playTone(1500, 75, 'square');

export const playGameOverSound = () => {
    // Play a simple descending arpeggio for game over
    setTimeout(() => playTone(523.25, 150, 'sine'), 0); 
    setTimeout(() => playTone(440, 150, 'sine'), 150);
    setTimeout(() => playTone(349.23, 150, 'sine'), 300);
    setTimeout(() => playTone(261.63, 300, 'sine'), 450);
};