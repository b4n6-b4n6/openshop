/* eslint-disable no-restricted-syntax */
import fs from 'node:fs/promises';
import checkAccess from './checkAccess.js';

const createDebounced = (onData) => {
  let lastData;
  return (data) => {
    if (lastData === undefined || lastData !== data) {
      onData(data);
      lastData = data;
    }
  };
};

const ipcTrack = async (path, onData) => {
  const debouncedOnData = createDebounced(onData);

  const readAndReact = async () => {
    const data = (await fs.readFile(path)).toString();
    debouncedOnData(data);
  };

  if (!(await checkAccess(path))) {
    await fs.writeFile(path, '');
  }

  await readAndReact();

  const ac = new AbortController();

  (async () => {
    try {
      const watcher = fs.watch(path, { signal: ac.signal });

      for await (const event of watcher) {
        if (event.eventType === 'change') {
          await readAndReact();
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') { return; }

      throw err;
    }
  })();

  return () => { ac.abort(); };
};

const ipcWrite = async (path, data) => {
  await fs.writeFile(path, data);
};

export {
  ipcTrack,
  ipcWrite,
};
