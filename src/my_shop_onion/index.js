import {
  MY_SHOP_ONION_LAUNCH_IPC,
  MY_SHOP_ONION_PROGRESS_IPC,
  MY_SHOP_TORRC_PATH,
} from '../const.js';
import { ipcTrack, ipcWrite } from '../utils/ipc.js';
import spinUp from './utils/spinUp.js';

await ipcWrite(MY_SHOP_ONION_PROGRESS_IPC, '');

ipcTrack(MY_SHOP_ONION_LAUNCH_IPC, (launch) => {
  if (!launch) { return; }

  if (launch === '1') {
    spinUp({
      torrcPath: MY_SHOP_TORRC_PATH,
      onBootstrapping: (progress) => {
        ipcWrite(MY_SHOP_ONION_PROGRESS_IPC, `${progress}`);
      },
      onError: (error) => {
        throw error;
      },
    });
  } else {
    throw new Error('unsupported');
  }
});
