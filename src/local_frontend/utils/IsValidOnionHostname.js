export default (oh) => (
  /^[a-z2-7]{16,56}\.onion$/i.test(oh)
);
