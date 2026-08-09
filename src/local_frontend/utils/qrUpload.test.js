import jsQR from 'jsqr';
import QRCode from 'qrcode';

const ONION = 'abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrstuvwx.onion';

test('self-hosted decoder reads an OpenShop onion QR image', () => {
  const qr = QRCode.create(ONION, { errorCorrectionLevel: 'H' });
  const scale = 5;
  const quietZone = 4;
  const side = (qr.modules.size + (quietZone * 2)) * scale;
  const pixels = new Uint8ClampedArray(side * side * 4).fill(255);

  for (let y = 0; y < qr.modules.size; y += 1) {
    for (let x = 0; x < qr.modules.size; x += 1) {
      if (qr.modules.get(x, y)) {
        for (let py = 0; py < scale; py += 1) {
          for (let px = 0; px < scale; px += 1) {
            const row = ((y + quietZone) * scale) + py;
            const column = ((x + quietZone) * scale) + px;
            const offset = ((row * side) + column) * 4;
            pixels[offset] = 0;
            pixels[offset + 1] = 0;
            pixels[offset + 2] = 0;
          }
        }
      }
    }
  }

  expect(jsQR(pixels, side, side, { inversionAttempts: 'attemptBoth' })?.data)
    .toBe(ONION);
});
