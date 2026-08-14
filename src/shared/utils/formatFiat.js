export default (amount, currency) => {
  try {
    return new Intl.NumberFormat('en', {
      currency: String(currency).toUpperCase(),
      maximumFractionDigits: 2,
      style: 'currency',
    }).format(Number(amount));
  } catch {
    return `${Number(amount).toFixed(2)} ${String(currency ?? '').toUpperCase()}`;
  }
};
