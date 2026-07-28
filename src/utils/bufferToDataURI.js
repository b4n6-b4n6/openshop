export default (mimeType, buffer) => (
  `data:${mimeType};base64,${buffer.toString('base64')}`
);
