import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

const formValue = (value) => String(Array.isArray(value) ? value[0] : value ?? '').trim();

export default async ({
  messages,
  sender,
  receiver,
  text: rawText,
  image,
}) => {
  const text = formValue(rawText);

  if (!text && !image) {
    return { error: 'Write a message or choose an image.', status: 400 };
  }
  if (image && !bufferToImageDataURI(image)) {
    return { error: 'Choose a valid PNG, JPEG, WebP, or GIF image.', status: 415 };
  }

  if (text) {
    await messages.create({
      sender,
      receiver,
      text_content: text,
    });
  }
  if (image) {
    await messages.create({
      sender,
      receiver,
      image_content: image,
    });
  }

  return {};
};
