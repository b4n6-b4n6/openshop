export default (value, head = 10, tail = 10) => {
  const text = String(value ?? '');
  return text.length <= head + tail + 1
    ? text
    : `${text.slice(0, head)}…${text.slice(-tail)}`;
};
