import createShops from './index.js';

const ONION_ADDRESS = '2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion';

test('can get a non-existent shop', async () => {
  const shops = await createShops();

  expect(await shops.get(ONION_ADDRESS)).toEqual(undefined);

  await shops.destroy();
});

test('can get or create a shop', async () => {
  const shops = await createShops();

  expect(await shops.getOrCreate(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo_exists: false,
    banner_photo_exists: false,
    name: '',
    description: '',
  });
  expect(await shops.getOrCreate(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo_exists: false,
    banner_photo_exists: false,
    name: '',
    description: '',
  });
  expect(await shops.get(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo_exists: false,
    banner_photo_exists: false,
    name: '',
    description: '',
  });

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
    profile_photo_exists: false,
    banner_photo_exists: false,
    name: 'Test Shop',
    description: 'We offer to test stuffs!',
  });

  await shops.destroy();
});

test('can update a shop: name, description', async () => {
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
    name: 'Test Shopz',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.get(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo_exists: false,
    banner_photo_exists: false,
    name: 'Test Shopz',
    description: 'We offer to test many stuffs!',
  });

  await shops.destroy();
});

test('can update a shop: profile_photo, banner_photo', async () => {
  const shops = await createShops();

  await shops.update({
    address: ONION_ADDRESS,
    profile_photo: Buffer.from('deadbeef', 'hex'),
    banner_photo: Buffer.from('d222d222', 'hex'),
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.get(ONION_ADDRESS)).toEqual({
    address: ONION_ADDRESS,
    profile_photo_exists: true,
    banner_photo_exists: true,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.getProfilePhoto(ONION_ADDRESS)).toEqual(Buffer.from('deadbeef', 'hex'));
  expect(await shops.getBannerPhoto(ONION_ADDRESS)).toEqual(Buffer.from('d222d222', 'hex'));

  await shops.destroy();
});

test('can update a shop: name, description, profile_photo, banner_photo', async () => {
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
    profile_photo: Buffer.from('deadbeef', 'hex'),
    banner_photo: Buffer.from('d222d222', 'hex'),
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
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
    profile_photo_exists: true,
    banner_photo_exists: true,
    name: 'Test Shop',
    description: 'We offer to test many stuffs!',
  });
  expect(await shops.getProfilePhoto(ONION_ADDRESS)).toEqual(Buffer.from('deadbeef', 'hex'));
  expect(await shops.getBannerPhoto(ONION_ADDRESS)).toEqual(Buffer.from('d222d222', 'hex'));

  await shops.destroy();
});
