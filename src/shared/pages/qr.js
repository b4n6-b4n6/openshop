import { ASSET_VERSION } from '../../const.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { button, icon } from './layout.js';

const qrArtwork = ({ size, qr }) => (
  `<span class="qr-art" style="--qr-size:${size}px">
    <img data-qr-image src="${escapeAttribute(qr)}" width="${size}" height="${size}" alt="">
    <span class="qr-watermark">
      <img data-qr-logo src="/static/images/logo-orange.svg?v=${ASSET_VERSION}" alt="OpenShop">
    </span>
  </span>`
);

export const qrViewModal = ({
  caption = '',
  qr,
}) => (
  `<div data-qr-modal class="qr-modal" role="dialog" aria-modal="true" aria-label="QR code" hidden>
    <button type="button" data-qr-close class="qr-modal-close" aria-label="Close QR code">
      ${icon('close')}
    </button>
    <div class="qr-modal-panel">
      <div class="qr-large">${qrArtwork({ size: 240, qr })}</div>
      ${caption ? `<p class="qr-caption">${escapeHtml(caption)}</p>` : ''}
      <p data-qr-save-error role="alert" class="hidden text-[12px] text-danger"></p>
      ${button({
        label: 'Save image',
        buttonIcon: icon('download', 'size-4'),
        attributes: 'data-qr-save',
      })}
    </div>
  </div>`
);

export const qrView = ({
  qr,
  caption = '',
  fileName = 'openshop-qr.png',
  size = 64,
}) => (
  `<div data-qr-view data-file-name="${escapeAttribute(fileName)}">
    <button type="button" data-qr-open class="qr-trigger" aria-label="Enlarge QR code">
      ${qrArtwork({ size: Number(size), qr })}
    </button>
    ${qrViewModal({ qr, caption })}
  </div>`
);

export const qrViewButtonCrossFrame = ({
  qr,
  size = 64,
}) => (
  `<div data-qr-view>
    <button type="button" data-qr-open-cross-frame class="qr-trigger" aria-label="Enlarge QR code">
      ${qrArtwork({ size: Number(size), qr })}
    </button>
  </div>`
);

export const qrViewModalCrossFrame = ({
  qr,
  caption = '',
  fileName = 'openshop-qr.png',
}) => (
  `<div data-qr-view data-file-name="${escapeAttribute(fileName)}">
    ${qrViewModal({ qr, caption })}
  </div>`
);
