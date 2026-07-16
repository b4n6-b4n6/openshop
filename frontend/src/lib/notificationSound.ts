let audioContext: AudioContext | null = null;

function context(): AudioContext {
  audioContext ??= new AudioContext();
  return audioContext;
}

export async function primeNotificationAudio(): Promise<void> {
  const audio = context();
  if (audio.state === "suspended") await audio.resume();
}

export async function playMessageTing(): Promise<void> {
  await primeNotificationAudio();
  const audio = context();
  const now = audio.currentTime;

  const ring = (frequency: number, volume: number, duration: number, delay = 0) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + delay);
    gain.gain.setValueAtTime(volume, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now + delay);
    oscillator.stop(now + delay + duration);
  };

  ring(1046.5, 0.16, 0.32);
  ring(1568, 0.08, 0.24, 0.035);
}
