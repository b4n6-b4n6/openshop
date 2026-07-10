export default (func, rememberFor) => {
  let lastResult;
  let lastCheckTime;

  return async () => {
    const now = Date.now();

    if (!lastCheckTime || now - lastCheckTime > rememberFor) {
      lastResult = await func();
      lastCheckTime = now;
    }

    return lastResult;
  };
};
