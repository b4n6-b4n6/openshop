import {
  MY_SHOP_ONION_LAUNCH_IPC,
  MY_SHOP_ONION_PROGRESS_IPC,
} from '../../../const.js';
import { ipcTrack, ipcWrite } from '../../../utils/ipc.js';
import isDev from '../../../utils/isDev.js';
import readMyOnionHostname from '../../../utils/readMyOnionHostname.js';

export default class OnionSpinner {
  constructor() {
    this.progress = 0;
    this.onion = null;
    this.spinning = false;

    (async () => {
      if (!isDev) { return; }

      try {
        const onion = await readMyOnionHostname();
        this.onion = onion;
        this.progress = 100;
      } catch (err) {
        if (err.code === 'ENOENT') { return; }

        throw err;
      }
    })();
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
