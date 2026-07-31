/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import getStream, { getStreamAsBuffer } from 'get-stream';
import detectContentType from 'detect-content-type';

const promisifyClose = (cp) => new Promise((resolve) => {
  cp.on('close', resolve);
});

const convert = async (imageData, maxDimension) => {
  const imageFormat = detectContentType(imageData).replace(/^image\//, '');
  const cp = spawn(
    'convert',
    `- -resize ${maxDimension}x${maxDimension}> ${imageFormat}:-`.split(' '),
  );
  cp.stdin.end(imageData);

  const [out, err, code] = await Promise.all([
    getStreamAsBuffer(cp.stdout),
    getStream(cp.stderr),
    promisifyClose(cp),
  ]);

  if (code !== 0) {
    throw new Error(
      `convert failed with ${code} and '${err.replace(/\n$/, '')}'`,
    );
  }

  return out;
};
export default convert;
