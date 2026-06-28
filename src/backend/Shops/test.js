import createShops from './index.js';

test('can get no shop', async () => {
  const shops = await createShops();

  expect(await shops.get('example.onion')).toEqual(undefined);

  await shops.destroy();
});

test('can create a shop', async () => {
  const shops = await createShops();

  await shops.update({
    address: 'example.onion',
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });
  expect(await shops.get('example.onion')).toEqual({
    address: 'example.onion',
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });

  await shops.destroy();
});

test('can update a shop', async () => {
  const shops = await createShops();

  await shops.update({
    address: 'example.onion',
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });
  await shops.update({
    address: 'example.onion',
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.get('example.onion')).toEqual({
    address: 'example.onion',
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });

  await shops.destroy();
});
