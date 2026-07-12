export default (func) => {
  let lastResult;

  return () => {
    if (!lastResult) {
      lastResult = func();
    }

    return lastResult;
  };
};
