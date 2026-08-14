export default (amount) => {
  const value = Number(amount) / 1e12;
  if (!Number.isFinite(value)) { return '0'; }
  return value.toFixed(12).replace(/0+$/, '').replace(/\.$/, '');
};
