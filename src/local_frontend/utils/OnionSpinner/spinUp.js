import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { MY_SHOP_ONION_PATH } from '../../../const.js';

const readMyOnionHostname = async () => (
  (await fs.readFile(MY_SHOP_ONION_PATH, 'utf8')).trim()
);

const preparePrivateDirectory = async (directory) => {
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  await fs.chmod(directory, 0o700);
};

const spinUp = async ({
  torrcPath,
  onBootstrapped,
  onBootstrapping,
  onError,
}) => {
  await preparePrivateDirectory(path.dirname(MY_SHOP_ONION_PATH));
  await preparePrivateDirectory('.tor-my-shop');

  const p = spawn('tor', ['-f', torrcPath]);

  let outData = '';
  const outConsume = (lines) => {
    outData += lines;

    lines
      .split('\n')
      .filter((v) => !!v)
      .forEach((line) => {
        if (line.includes('Bootstrapped ')) {
          const log_parts = line.match(/Bootstrapped (\d+)%/);
          if (!log_parts || !log_parts.length || log_parts.length < 2) { return; }

          const percent = Number(log_parts[1]);
          onBootstrapping(percent);

          if (percent === 100) {
            readMyOnionHostname().then((oh) => {
              onBootstrapped(oh);
            }).catch(onError);
          }
        }
      });
  };

  p.stdout.on('data', (buffer) => { outConsume(buffer.toString()); });
  p.on('close', (code) => {
    console.error(outData);
    onError(new Error(`tor closed with status code of ${code}`));
  });
  p.on('error', (error) => { onError(error); });
};

export default spinUp;
