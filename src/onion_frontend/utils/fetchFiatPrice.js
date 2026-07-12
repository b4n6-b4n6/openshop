import { CoinGeckoClient } from 'coingecko-api-v3';
import createDebounced from './createDebounced.js';
import { CURRENCIES } from '../../const.js';

const client = new CoinGeckoClient({
  timeout: 30000,
});
const fetchFiatPrice = async () => {
  const response = await client.simplePrice({
    ids: 'monero',
    vs_currencies: CURRENCIES,
  });

  if (!response.success) {
    console.error(response.data);
    return null;
  }

  const result = response.data?.monero;

  if (!result) {
    console.error(result);
    return null;
  }

  return result;
};

const REMEMBER_FOR = 1000 * 60 * 5;
export default createDebounced(fetchFiatPrice, REMEMBER_FOR);
