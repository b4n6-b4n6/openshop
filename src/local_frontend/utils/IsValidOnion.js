export default (onion) => (
  /^[a-z2-7]{16,56}\.onion$/i.test(onion)
);
