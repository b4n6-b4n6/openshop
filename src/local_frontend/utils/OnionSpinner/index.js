import {
  MY_SHOP_ONION_LAUNCH_IPC,
  MY_SHOP_ONION_PROGRESS_IPC,
} from '../../../const.js';
import { ipcTrack, ipcWrite } from '../../../utils/ipc.js';
import readMyOnionHostname from '../../../utils/readMyOnionHostname.js';

export default class OnionSpinner {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.spinning = false;
  }

  spinUp() {
    if (this.spinning) { return; }
    this.spinning = true;

    ipcTrack(MY_SHOP_ONION_PROGRESS_IPC, async (progress) => {
      if (!progress) { return; }

      const p = Number(progress);

      if (p === 100) {
        this.onion = await readMyOnionHostname();
      }

      this.progress = p;
    });
    ipcWrite(MY_SHOP_ONION_LAUNCH_IPC, '1');
  }
}
