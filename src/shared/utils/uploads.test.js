import {
  dataImageToBuffer,
  embedUploadedImages,
} from './uploads.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';

test('recognises supported data images by signature', () => {
  expect(dataImageToBuffer(PNG)?.type).toBe('image/png');
  expect(dataImageToBuffer('data:image/png;base64,PHN2Zz4=')).toBeNull();
});

test('places uploaded images at editor placeholders', () => {
  expect(embedUploadedImages('before\n[image:0]\nafter', [PNG])).toBe(
    `before\n[img]${PNG}[/img]\nafter`,
  );
});

test('appends images when there is no placeholder', () => {
  expect(embedUploadedImages('text', [PNG])).toBe(`text\n\n[img]${PNG}[/img]`);
});
