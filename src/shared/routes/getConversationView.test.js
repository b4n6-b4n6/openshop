import { jest } from '@jest/globals';
import getConversationView from './getConversationView.js';

test('embeds only a tiny blurred preview for chat image messages', async () => {
  const image = Buffer.from('89504e470d0a1a0a00000000', 'hex');
  const getImageContent = jest.fn().mockResolvedValue(image);
  const genThumb = jest.fn(async (key, getValue, size) => {
    expect(key).toBe('message-preview:message-1');
    expect(size).toBe(16);
    await getValue();
    return image;
  });
  const backend = {
    messages: { getImageContent },
    orders: {},
  };

  const allExtMessages = [{
    ext_message_occured_at: new Date('2026-08-09T12:00:00.000Z'),
    ext_message_payload: {
      created_at: new Date('2026-08-09T12:00:00.000Z'),
      image_content_exists: true,
      read_at: null,
      received_at: null,
      receiver: 'shop',
      sender: 'customer',
      text_content: null,
    },
    ext_message_type: 'CONVO',
    id: 'message-1',
  }];

  const allExtMessagesEnhanced = await getConversationView({
    backend,
    allExtMessages,
    thumbnailCache: { genThumb },
  });

  expect(getImageContent).toHaveBeenCalledWith('message-1');
  expect(allExtMessagesEnhanced[0].ext_message_payload.image_blur_preview)
    .toMatch(/^data:image\/png;base64,/);
  expect(allExtMessagesEnhanced[0].ext_message_payload).not.toHaveProperty('image_content');
});
