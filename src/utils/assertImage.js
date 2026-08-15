/* eslint-disable import/no-unresolved */
import { fileTypeFromBuffer } from 'file-type';

const WHITELIST = ['jpg', 'png', 'apng', 'gif', 'webp'];

export default async (imageData) => {
  const fileType = await fileTypeFromBuffer(imageData);

  if (!fileType || !WHITELIST.includes(fileType.ext)) {
    throw new Error(
      `Bad type for image - specify ${WHITELIST.join(', ')}`,
    );
  }
};
