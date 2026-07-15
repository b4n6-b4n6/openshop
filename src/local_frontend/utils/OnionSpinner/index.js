import { MY_SHOP_TORRC_PATH } from '../../../const.js';
import spinUp from './spinUp.js';

export default class OnionSpinner {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.spinning = false;
  }

  spinUp() {
    if (this.spinning) { return; }
    this.spinning = true;

    spinUp({
      torrcPath: MY_SHOP_TORRC_PATH,
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
