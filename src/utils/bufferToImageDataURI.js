import bufferToDataURI from './bufferToDataURI.js';

const imageMimeType = (buffer) => {
  const start = buffer.subarray(0, 12);
  if (start.subarray(0, 4).toString('hex') === '89504e47') return 'image/png';
  if (start.subarray(0, 3).toString('hex') === 'ffd8ff') return 'image/jpeg';
  if (/^GIF8[79]a$/.test(start.subarray(0, 6).toString())) return 'image/gif';
  if (
    start.subarray(0, 4).toString() === 'RIFF'
    && start.subarray(8, 12).toString() === 'WEBP'
  ) return 'image/webp';
  return null;
};

export default (buffer) => {
  if (!buffer) return null;

  const mimeType = imageMimeType(buffer);
  return mimeType ? bufferToDataURI(mimeType, buffer) : null;
};
