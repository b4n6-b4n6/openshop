import { PublicError, errorBody, toPublicError } from './publicError.js';

test('maps a Monero view-key failure to a safe field error', () => {
  const error = toPublicError(new Error('failed to parse secret view key'));

  expect(error).toMatchObject({
    status: 400,
    code: 'invalid_view_key',
    field: 'privateViewKey',
  });
  expect(error.message).not.toContain('stack');
});

test('does not expose unexpected internal error messages', () => {
  const error = toPublicError(new Error('password=database-secret'));

  expect(error).toMatchObject({
    status: 500,
    code: 'internal_error',
  });
  expect(error.message).not.toContain('database-secret');
});

test('maps multipart size failures to a visible upload error', () => {
  const error = toPublicError({ httpCode: 413, message: 'formidable details' });

  expect(error).toMatchObject({
    status: 413,
    code: 'image_too_large',
  });
  expect(error.message).toContain('2 MB');
});

test('serializes public errors using the API error contract', () => {
  const error = new PublicError('Bad input', {
    status: 400,
    code: 'bad_input',
    field: 'name',
  });

  expect(errorBody(error)).toEqual({
    error: { code: 'bad_input', message: 'Bad input', field: 'name' },
  });
});
