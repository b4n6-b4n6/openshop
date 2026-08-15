import fs from 'fs';
import convert from './convert.js';

test('convert 200x200 noise', async () => {
  const file = fs.readFileSync('src/backend/ThumbCache/noise-200x200.png');
  const thumbnail = fs.readFileSync('src/backend/ThumbCache/noise-200x200-thumbnail.png');

  expect((await convert(file, 100)).length).toEqual(thumbnail.length);
});

test('convert 200x150 noise', async () => {
  const file = fs.readFileSync('src/backend/ThumbCache/noise-200x150.png');
  const thumbnail = fs.readFileSync('src/backend/ThumbCache/noise-200x150-thumbnail.png');

  expect((await convert(file, 100)).length).toEqual(thumbnail.length);
});
