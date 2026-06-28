import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const readMyOnion = async () => (
  readFile('./my_shop_onion/hidden_service/hostname', 'utf8')
);

const spinUp = ({
  onBootstrapped,
  onBootstrapping,
  onError,
}) => {
  const p = spawn('tor', ['-f', './my_shop_onion/torrc']);

  const consume = (lines) => {
    lines
      .split('\n')
      .filter((v) => !!v)
      .forEach((line) => {
        const parts = line.split(/(?: \[)|(?:\] )/);
        if (!parts) { return; }

        const log = parts[2];

        if (log.startsWith('Bootstrapped ')) {
          const parts_2 = log.match(/Bootstrapped (\d+)%/);
          if (!(parts_2 && !!parts_2[1])) { return; }

          const percent = Number(parts_2[1]);
          onBootstrapping(percent);

          if (percent === 100) {
            readMyOnion().then((onion) => {
              onBootstrapped(onion);
            });
          }
        }
      });
  };

  p.stdout.on('data', (buffer) => { consume(buffer.toString()); });
  p.on('close', (code) => { p.emit('error', new Error(`tor closed with ${code}`)); });
  p.on('error', (error) => { onError(error); });
};

export default spinUp;
