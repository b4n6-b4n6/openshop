import fs from 'fs';
import convert from './convert.js';

const file = fs.readFileSync('src/backend/ThumbnailCache/noise-200x200.png');
const thumbnail = fs.readFileSync('src/backend/ThumbnailCache/noise-200x200-thumbnail.png');

test('convert', async () => {
  expect((await convert(file)).length).toEqual(thumbnail.length);
});
