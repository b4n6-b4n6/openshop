/* eslint-disable import/no-unresolved */
import { spawn } from 'node:child_process';
import consumers from 'node:stream/consumers';
import { fileTypeFromBuffer } from 'file-type';

const promisifyClose = (cp) => new Promise((resolve) => {
  cp.on('close', resolve);
});

const convert = async (imageData, compressionParams) => {
  let maxDimension;
  let quality;
  let imageFormat;

  if (Array.isArray(compressionParams)) {
    [maxDimension, quality, imageFormat] = compressionParams;
  } else {
    maxDimension = compressionParams;
  }

  const fileType = await fileTypeFromBuffer(imageData);
  imageFormat = imageFormat ?? fileType.ext;
  const cp = spawn(
    'convert',
    [
      '-',
      ...(quality ? ['-quality', `${quality}`] : []),
      '-resize',
      `${maxDimension}x${maxDimension}>`,
      `${imageFormat}:-`,
    ],
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
