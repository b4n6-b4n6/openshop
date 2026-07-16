import { MY_SHOP_TORRC_PATH } from '../../../const.js';
import spinUp from './spinUp.js';
import { errorBody, toPublicError } from '../../../utils/publicError.js';

export default class OnionSpinner {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.spinning = false;
    this.lastError = null;
  }

  spinUp() {
    if (this.spinning) { return; }
    this.spinning = true;
    this.lastError = null;

    const onError = (error) => {
      console.error(error);
      this.spinning = false;
      this.lastError = errorBody(toPublicError(error, {
        code: 'onion_start_failed',
        message: 'The Tor onion service could not start. Check that Tor is installed and try again.',
      })).error;
    };

    spinUp({
      torrcPath: MY_SHOP_TORRC_PATH,
      onBootstrapping: (progress) => {
        this.progress = progress;
      },
      onBootstrapped: (onion) => {
        this.onion = onion;
        this.spinning = false;
        this.lastError = null;
      },
      onError,
    }).catch(onError);
  }
}
