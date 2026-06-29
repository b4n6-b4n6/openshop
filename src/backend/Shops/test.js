import createShops from './index.js';

const ONION_ADDRESS = '2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion';

test('can get no shop', async () => {
  const shops = await createShops();

  expect(await shops.get(ONION_ADDRESS)).toEqual(undefined);

  await shops.destroy();
});

test('can create a shop', async () => {
  const shops = await createShops();

  await shops.update({
    address: ONION_ADDRESS,
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });
  expect(await shops.get(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
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
    address: ONION_ADDRESS,
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });
  await shops.update({
    address: ONION_ADDRESS,
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.get(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo: null,
    banner_photo: null,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });

  await shops.destroy();
});
