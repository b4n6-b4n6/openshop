import timers from 'node:timers/promises';
import { CURRENCIES } from '../../const.js';
import fetchFiatRates from './fetchFiatRates.js';

test('returns a currency greater than 0', async () => {
  expect((await fetchFiatRates())[CURRENCIES[0]]).toBeGreaterThan(0);
});

test('debounces', async () => {
  const a = await fetchFiatRates();
  await timers.setTimeout(25);
  const b = await fetchFiatRates();
  expect(a).toEqual(b);
});
