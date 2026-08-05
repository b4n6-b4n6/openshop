import bufferToImageDataURI from './bufferToImageDataURI.js';

test.each([
  ['png', '89504e470d0a1a0a', 'image/png'],
  ['jpeg', 'ffd8ffe000104a464946', 'image/jpeg'],
  ['gif', Buffer.from('GIF89a').toString('hex'), 'image/gif'],
  ['webp', Buffer.from('RIFF0000WEBP').toString('hex'), 'image/webp'],
])('detects %s image data', (name, hex, mimeType) => {
  const result = bufferToImageDataURI(Buffer.from(hex, 'hex'));
  expect(result).toMatch(new RegExp(`^data:${mimeType};base64,`));
});

test('rejects an unknown buffer type', () => {
  expect(bufferToImageDataURI(Buffer.from('not an image'))).toBeNull();
});
