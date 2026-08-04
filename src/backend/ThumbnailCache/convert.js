/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import consumers from 'node:stream/consumers';
import { fileTypeFromBuffer } from 'file-type';

const promisifyClose = (cp) => new Promise((resolve) => {
  cp.on('close', resolve);
});

const convert = async (imageData, maxDimension) => {
  const fileType = await fileTypeFromBuffer(imageData);
  const imageFormat = fileType.ext;
  const cp = spawn(
    'convert',
    `- -resize ${maxDimension}x${maxDimension}> ${imageFormat}:-`.split(' '),
  );
  cp.stdin.end(imageData);

  const [out, err, code] = await Promise.all([
    consumers.buffer(cp.stdout),
    consumers.text(cp.stderr),
    promisifyClose(cp),
  ]);

  if (code !== 0) {
    throw new Error(`convert failed with ${code} and '${err.replace(/\n$/, '')}'`);
  }

  return out;
};
export default convert;
