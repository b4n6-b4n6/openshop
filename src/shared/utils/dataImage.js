export default (value) => (
  typeof value === 'string' && /^data:image\/(?:gif|jpeg|png|webp);base64,/i.test(value)
);
