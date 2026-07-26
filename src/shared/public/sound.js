/* global document, window */
(() => {
  const BrowserAudioContext = window.AudioContext || window.webkitAudioContext;
  let audio;

  const context = async () => {
    if (!BrowserAudioContext) {
      throw new Error('This browser does not support notification audio');
    }
    audio ??= new BrowserAudioContext();
    if (audio.state === 'suspended') await audio.resume();
    if (audio.state !== 'running') {
      throw new Error('Notification audio is blocked until the page is tapped');
    }
    return audio;
  };

  window.primeMessageTing = context;
  window.playMessageTing = async () => {
    const output = await context();
    const now = output.currentTime;
    [
      [1046.5, 0.16, 0.32, 0],
      [1568, 0.08, 0.24, 0.035],
    ].forEach(([frequency, volume, duration, delay]) => {
      const oscillator = output.createOscillator();
      const gain = output.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      gain.gain.setValueAtTime(volume, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      oscillator.connect(gain);
      gain.connect(output.destination);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration);
    });
  };

  const prime = () => context().catch((error) => {
    console.error('Could not enable the new-message sound', error);
  });
  document.addEventListener('pointerdown', prime, { once: true });
  document.addEventListener('keydown', prime, { once: true });
})();
