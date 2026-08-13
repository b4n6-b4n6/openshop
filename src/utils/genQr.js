import QRCode from 'qrcode';

export default (uri) => QRCode.toDataURL(
  uri,
  {
    color: { dark: '#0f1115', light: '#ffffff' },
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 240,
  },
);
