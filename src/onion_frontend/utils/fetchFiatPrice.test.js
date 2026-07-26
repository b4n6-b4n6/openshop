import { extractMoneroPrices } from './fetchFiatPrice.js';

test('reads the direct response returned by coingecko-api-v3', () => {
  expect(extractMoneroPrices({
    monero: { usd: 321.45, eur: 299.1 },
  })).toEqual({ usd: 321.45, eur: 299.1 });
});

test('also accepts the legacy wrapped response shape', () => {
  expect(extractMoneroPrices({
    data: { monero: { usd: 321.45 } },
  })).toEqual({ usd: 321.45 });
});

test('rejects a response without Monero prices', () => {
  expect(extractMoneroPrices({})).toBeNull();
});
