import { jest } from '@jest/globals';
import createChatMessages from './createChatMessages.js';

const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');

test('rejects an empty message with a visible validation error', async () => {
  const create = jest.fn();
  const result = await createChatMessages({
    messages: { create },
    receiver: 'shop',
    sender: 'customer',
    text: '   ',
  });

  expect(result).toEqual({
    error: 'Write a message or choose an image.',
    status: 400,
  });
  expect(create).not.toHaveBeenCalled();
});

test('stores text and a selected image as separate conversation events', async () => {
  const create = jest.fn().mockResolvedValue(undefined);
  const result = await createChatMessages({
    image: png,
    messages: { create },
    receiver: 'shop',
    sender: 'customer',
    text: ' hello ',
  });

  expect(result).toEqual({});
  expect(create).toHaveBeenNthCalledWith(1, {
    receiver: 'shop',
    sender: 'customer',
    text_content: 'hello',
  });
  expect(create).toHaveBeenNthCalledWith(2, {
    image_content: png,
    receiver: 'shop',
    sender: 'customer',
  });
});
