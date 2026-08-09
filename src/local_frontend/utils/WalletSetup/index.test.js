import { jest } from '@jest/globals';
import { MY_SHOP_WALLET_PATH } from '../../../const.js';
import createWalletSetup from './index.js';

test('loads the existing wallet address when the local frontend starts', async () => {
  const checkWalletAccess = jest.fn().mockResolvedValue(true);
  const readWalletAddress = jest.fn().mockResolvedValue('4existing-address');

  const walletSetup = await createWalletSetup({
    checkWalletAccess,
    readWalletAddress,
  });

  expect(checkWalletAccess).toHaveBeenCalledWith(MY_SHOP_WALLET_PATH);
  expect(readWalletAddress).toHaveBeenCalledTimes(1);
  expect(walletSetup.completed).toBe(true);
  expect(walletSetup.address).toBe('4existing-address');
});

test('does not read an address before a wallet has been created', async () => {
  const readWalletAddress = jest.fn();

  const walletSetup = await createWalletSetup({
    checkWalletAccess: jest.fn().mockResolvedValue(false),
    readWalletAddress,
  });

  expect(readWalletAddress).not.toHaveBeenCalled();
  expect(walletSetup.completed).toBe(false);
  expect(walletSetup.address).toBeNull();
});
