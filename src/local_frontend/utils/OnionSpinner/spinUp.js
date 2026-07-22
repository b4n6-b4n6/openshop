import { spawn } from 'node:child_process';
import readMyOnionHostname from '../../../utils/readMyOnionHostname.js';

const spinUp = ({
  torrcPath,
  onBootstrapped,
  onBootstrapping,
  onError,
}) => {
  const p = spawn('tor', ['-f', torrcPath]);

  let outData = '';
  const outConsume = (lines) => {
    outData += lines;

    lines
      .split('\n')
      .filter((v) => !!v)
      .forEach((line) => {
        const line_parts = line.split(/(?: \[)|(?:\] )/);
        if (!line_parts) { return; }

        const log = line_parts[2];

        if (log.startsWith('Bootstrapped ')) {
          const log_parts = log.match(/Bootstrapped (\d+)%/);
          if (!log_parts || !log_parts.length || log_parts.length < 2) { return; }

          const percent = Number(log_parts[1]);
          onBootstrapping(percent);

          if (percent === 100) {
            readMyOnionHostname().then((oh) => {
              onBootstrapped(oh);
            });
          }
        }
      });
  };

  p.stdout.on('data', (buffer) => { outConsume(buffer.toString()); });
  p.on('close', (code) => {
    console.error(outData);

    p.emit('error', new Error(`tor closed with status code of ${code}`));
  });
  p.on('error', (error) => { onError(error); });
};

export default spinUp;
