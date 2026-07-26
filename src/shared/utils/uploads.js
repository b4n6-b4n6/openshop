import fs from 'node:fs/promises';
import { PublicError } from '../../utils/publicError.js';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_INLINE_IMAGES = 5;
export const MAX_RICH_DESCRIPTION_BYTES = 14 * 1024 * 1024;

const IMAGE_TYPES = {
  'image/gif': (buffer) => (
    buffer.subarray(0, 6).toString('ascii') === 'GIF87a'
    || buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  ),
  'image/jpeg': (buffer) => (
    buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff
  ),
  'image/png': (buffer) => (
    buffer.length >= 8
    && buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ),
  'image/webp': (buffer) => (
    buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ),
};

export const detectImageType = (buffer) => (
  Object.entries(IMAGE_TYPES)
    .find(([, matches]) => matches(buffer))?.[0]
);

export const dataImageToBuffer = (value, { maxBytes = MAX_IMAGE_BYTES } = {}) => {
  const match = /^data:(image\/(?:gif|jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
    String(value ?? '').trim(),
  );
  if (!match) { return null; }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0 || buffer.length > maxBytes) { return null; }
  if (detectImageType(buffer) !== match[1]) { return null; }
  return { buffer, type: match[1] };
};

export const isSafeDataImage = (value, options) => (
  Boolean(dataImageToBuffer(value, options))
);

const asFiles = (value) => {
  if (!value) { return []; }
  return (Array.isArray(value) ? value : [value])
    .filter((file) => file?.filepath && Number(file.size) > 0);
};

export const uploadedFiles = (files, field) => asFiles(files?.[field]);

export const uploadedImageToDataUrl = async (
  file,
  { maxBytes = MAX_IMAGE_BYTES } = {},
) => {
  if (!file?.filepath) { return null; }

  const size = Number(file.size);
  if (!Number.isFinite(size) || size <= 0) { return null; }
  if (size > maxBytes) {
    throw new PublicError(
      `Image "${file.originalFilename ?? 'upload'}" is larger than 2 MB.`,
      { status: 413, code: 'image_too_large' },
    );
  }

  const buffer = await fs.readFile(file.filepath);
  const type = detectImageType(buffer);
  if (!type) {
    throw new PublicError(
      'Only genuine PNG, JPEG, WebP, and GIF images are supported.',
      { status: 415, code: 'invalid_image' },
    );
  }

  return `data:${type};base64,${buffer.toString('base64')}`;
};

export const cleanupUploads = async (files = {}) => {
  const paths = Object.values(files)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((file) => file?.filepath)
    .filter(Boolean);

  await Promise.all(paths.map(async (path) => {
    try {
      await fs.unlink(path);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Could not remove temporary upload', error);
      }
    }
  }));
};

export const embedUploadedImages = (description, images) => {
  if (images.length > MAX_INLINE_IMAGES) {
    throw new PublicError(
      `Descriptions support up to ${MAX_INLINE_IMAGES} inline images.`,
      { status: 400, code: 'too_many_inline_images' },
    );
  }

  const used = new Set();
  let richText = String(description ?? '').replace(
    /\[image:(\d+)\]/gi,
    (placeholder, rawIndex) => {
      const index = Number(rawIndex);
      if (!images[index]) { return placeholder; }
      used.add(index);
      return `[img]${images[index]}[/img]`;
    },
  );

  const unused = images
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => !used.has(index))
    .map(({ image }) => `[img]${image}[/img]`);

  if (unused.length > 0) {
    richText = [richText.trimEnd(), ...unused].filter(Boolean).join('\n\n');
  }

  if (Buffer.byteLength(richText, 'utf8') > MAX_RICH_DESCRIPTION_BYTES) {
    throw new PublicError(
      'The rich description is too large. Remove an image or shorten the text.',
      { status: 413, code: 'description_too_large' },
    );
  }

  return richText;
};
