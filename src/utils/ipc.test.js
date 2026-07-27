import fs from 'node:fs/promises';
import timers from 'node:timers/promises';
import { jest } from '@jest/globals';
import { ipcWrite, ipcTrack } from './ipc.js';

test('zoer', async () => {
  const IPC_TEST_PATH = '.IPC_TEST.zoer';

  try {
    await fs.rm(IPC_TEST_PATH);
  } catch (err) {
    if (!(err.code === 'ENOENT')) {
      throw err;
    }
  }

  const onData = jest.fn();
  const kill = await ipcTrack(IPC_TEST_PATH, onData);

  expect(onData).toHaveBeenCalledTimes(1);
  expect(onData).toHaveBeenLastCalledWith('');

  kill();
  await fs.rm(IPC_TEST_PATH);
});

test('once', async () => {
  const IPC_TEST_PATH = '.IPC_TEST.once';

  await ipcWrite(IPC_TEST_PATH, 'hello');

  const onData = jest.fn();
  const kill = await ipcTrack(IPC_TEST_PATH, onData);

  expect(onData).toHaveBeenCalledTimes(1);
  expect(onData).toHaveBeenLastCalledWith('hello');

  kill();
  await fs.rm(IPC_TEST_PATH);
});

test('twice', async () => {
  const IPC_TEST_PATH = '.IPC_TEST.twice';

  await ipcWrite(IPC_TEST_PATH, 'hello');

  const onData = jest.fn();
  const kill = await ipcTrack(IPC_TEST_PATH, onData);
  expect(onData).toHaveBeenCalledTimes(1);
  expect(onData).toHaveBeenLastCalledWith('hello');

  await ipcWrite(IPC_TEST_PATH, 'world');
  await timers.setTimeout(500);
  expect(onData).toHaveBeenCalledTimes(2);
  expect(onData).toHaveBeenLastCalledWith('world');

  kill();
  await fs.rm(IPC_TEST_PATH);
});

test('quattro', async () => {
  const IPC_TEST_PATH = '.IPC_TEST.quattor';

  await ipcWrite(IPC_TEST_PATH, 'hello');

  const onData = jest.fn();
  const kill = await ipcTrack(IPC_TEST_PATH, onData);

  expect(onData).toHaveBeenLastCalledWith('hello');

  await ipcWrite(IPC_TEST_PATH, 'world');
  await timers.setTimeout(500);
  expect(onData).toHaveBeenCalledTimes(2);
  expect(onData).toHaveBeenLastCalledWith('world');

  await ipcWrite(IPC_TEST_PATH, '!');
  await timers.setTimeout(500);
  expect(onData).toHaveBeenCalledTimes(3);
  expect(onData).toHaveBeenLastCalledWith('!');

  kill();
  await fs.rm(IPC_TEST_PATH);
});
