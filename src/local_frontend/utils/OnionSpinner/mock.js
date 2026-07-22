import readMyOnionHostname from '../../../utils/readMyOnionHostname.js';

export default class OnionSpinnerMock {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.spinning = false;
  }

  spinUp() {
    if (this.spinning) { return; }
    this.spinning = true;
    this.progress = 100;
    readMyOnionHostname().then((oh) => { this.onion = oh; });
  }
}
