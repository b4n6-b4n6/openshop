const DP = BigInt(1e12);
export default (amount) => {
  const adp = amount % DP;
  const bdp = (amount - adp) / DP;
  const f_adp = adp.toString().padStart(12, '0');
  return `${bdp}.${f_adp.slice(0, 4)} ${f_adp.slice(4, 8)}`;
};
