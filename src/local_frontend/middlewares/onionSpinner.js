import OnionSpinner from '../utils/OnionSpinner/index.js';
import OnionSpinnerMock from '../utils/OnionSpinner/mock.js';

export default () => {
  const onionSpinner = process.env.MOCK_ONION_SPINNER
    ? new OnionSpinnerMock()
    : new OnionSpinner();

  return async (ctx, next) => {
    ctx.onionSpinner = onionSpinner;

    await next();
  };
};
