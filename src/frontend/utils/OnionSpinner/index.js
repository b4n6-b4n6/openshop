import spinUp from './spinUp.js';

export default class OnionSpinner {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.isSpinning = false;
  }

  spinUp() {
    if (this.isSpinning) { return; }
    this.isSpinning = true;

    spinUp({
      onBootstrapping: (progress) => {
        this.progress = progress;
      },
      onBootstrapped: (onion) => {
        this.onion = onion;
      },
      onError: (error) => {
        throw error;
      },
    });
  }
}
