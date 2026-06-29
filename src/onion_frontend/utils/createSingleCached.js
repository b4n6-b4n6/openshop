export default (func) => {
  let lastResult;

  return async () => {
    if (!lastResult) {
      lastResult = func();
    }

    return lastResult;
  };
};
