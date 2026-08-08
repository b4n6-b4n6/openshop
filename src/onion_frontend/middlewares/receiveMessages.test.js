import { jest } from '@jest/globals';
import receiveMessages from './receiveMessages.js';

test('acknowledges owner messages before rendering a customer page', async () => {
  const markAllReceivedInConvo = jest.fn().mockResolvedValue(undefined);
  const next = jest.fn().mockResolvedValue(undefined);
  const ctx = {
    backend: { messages: { markAllReceivedInConvo } },
    myOnion: 'shop.onion',
    state: { user: { userId: 'customer-1' } },
  };

  await receiveMessages()(ctx, next);

  expect(markAllReceivedInConvo).toHaveBeenCalledWith({
    receiver: 'customer-1',
    sender: 'shop.onion',
  });
  expect(next).toHaveBeenCalledTimes(1);
});
