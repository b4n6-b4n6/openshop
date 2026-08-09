import { jest } from '@jest/globals';
import createMessages from './index.js';

test('marks only previously unreceived messages with the current time', async () => {
  const pool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };
  const messages = await createMessages(pool);

  await messages.markAllReceivedInConvo({
    receiver: 'customer',
    sender: 'shop',
  });

  const [sql, params] = pool.query.mock.calls[1];
  expect(sql).toContain('SET received_at = now()');
  expect(sql).toContain('received_at IS NULL');
  expect(params).toEqual(['shop', 'customer']);
});
