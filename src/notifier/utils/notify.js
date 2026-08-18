import notifier from 'node-notifier';
import path from 'path';

const BEEP_PATH = './src/shared/public/message-ting.wav';
const ICON_PATH = './src/shared/public/images/logo-orange-0.png';

export default (message) => {
  notifier.notify({
    'app-name': 'OpenShop',
    title: message,
    hint: `string:sound-file:${path.resolve(BEEP_PATH)}`,
    sound: path.resolve(BEEP_PATH),
    icon: path.resolve(ICON_PATH),
    wait: true,
    message: '...',
  });
};
