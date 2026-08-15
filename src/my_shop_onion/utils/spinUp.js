import { spawn } from 'node:child_process';

const spinUp = ({
  torrcPath,
  onBootstrapping,
  onError,
}) => {
  const p = spawn('tor', ['-f', torrcPath]);

  const outConsume = (lines) => {
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
        }
      });
  };

  p.stdout.on('data', (buffer) => {
    outConsume(buffer.toString());
    process.stdout.write(buffer);
  });
  p.stderr.pipe(process.stderr);
  p.on('close', (code) => {
    p.emit('error', new Error(`Tor closed with status code of ${code}`));
  });
  p.on('error', (error) => { onError(error); });
};

export default spinUp;
