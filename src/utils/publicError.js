export class PublicError extends Error {
  constructor(message, { status = 500, code = 'unknown', field } = {}) {
    super(message);
    this.name = 'PublicError';
    this.status = status;
    this.code = code;
    this.field = field;
    this.expose = true;
  }
}

const messageOf = (error) => (
  error instanceof Error ? error.message : String(error ?? '')
);

export const toPublicError = (error, fallback = {}) => {
  if (error instanceof PublicError) { return error; }

  const rawMessage = messageOf(error);

  if (/secret view key/i.test(rawMessage)) {
    return new PublicError(
      'The private view key is invalid. Enter a 64-character hexadecimal Monero view key.',
      { status: 400, code: 'invalid_view_key', field: 'privateViewKey' },
    );
  }

  if (/(failed to parse|invalid).*(address)|address.*(failed to parse|invalid)/i.test(rawMessage)) {
    return new PublicError(
      'The Monero primary address is invalid.',
      { status: 400, code: 'invalid_wallet_address', field: 'primaryAddress' },
    );
  }

  if (error?.status && error.status >= 400 && error.status < 500 && error.expose) {
    return new PublicError(rawMessage || 'The request is invalid.', {
      status: error.status,
      code: error.code ?? fallback.code ?? 'invalid_request',
      field: error.field,
    });
  }

  return new PublicError(
    fallback.message ?? 'OpenShop could not complete this request. Please try again.',
    {
      status: fallback.status ?? 500,
      code: fallback.code ?? 'internal_error',
      field: fallback.field,
    },
  );
};

export const errorBody = (error) => ({
  error: {
    code: error.code,
    message: error.message,
    ...(error.field ? { field: error.field } : {}),
  },
});
