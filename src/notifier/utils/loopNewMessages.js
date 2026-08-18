import createMessages from '../../backend/Messages/index.js';
import readMyOnionHostname from '../../utils/readMyOnionHostname.js';
import notify from './notify.js';

const NEW_MESSAGE_POLL_INTERVAL = 1000 * 10;
const NEW_MESSAGE_MSG = 'You have new messages!';

export default async (pool) => {
  const myOnion = await readMyOnionHostname();
  const messages = await createMessages(pool);

  let lastUnread = null;
  setInterval(
    async () => {
      const newUnread = await messages.getUnread(myOnion);

      if ((lastUnread === false || lastUnread === null) && newUnread === true) {
        console.log(`${(new Date()).toISOString()}`, 'Notifying...');

        notify(NEW_MESSAGE_MSG);
      }

      lastUnread = newUnread;
    },
    NEW_MESSAGE_POLL_INTERVAL,
  );
};
