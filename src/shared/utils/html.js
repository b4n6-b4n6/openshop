export const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const escapeAttribute = escapeHtml;

export const formValue = (value, fallback = '') => {
  const resolved = Array.isArray(value) ? value.at(-1) : value;
  return resolved === undefined || resolved === null
    ? fallback
    : String(resolved);
};

export const joinClasses = (...classes) => classes.filter(Boolean).join(' ');
