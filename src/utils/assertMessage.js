import assertImage from './assertImage.js';

export default async ({ image_content, text_content }) => {
  if (!text_content && !image_content) {
    throw new Error('Bad options for message - specify text or image content');
  }

  if (text_content && image_content) {
    throw new Error('Bad options for message - specify only one of text or image content');
  }

  if (image_content) { await assertImage(image_content); }
};
