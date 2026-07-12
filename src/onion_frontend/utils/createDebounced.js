export default (func, rememberFor) => {
  let lastResult;
  let lastCheckTime;

  return () => {
    const now = Date.now();

    if (!lastCheckTime || now - lastCheckTime > rememberFor) {
      lastResult = func();
      lastCheckTime = now;
    }

    return lastResult;
  };
};
