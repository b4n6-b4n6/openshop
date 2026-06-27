import { useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useEnlarge } from "../../lib/hooks";

/** QR for an onion address or Monero subaddress. Tap to enlarge + save as PNG. */
export function QRView({
  value,
  size = 150,
  caption,
  fileName = "openshop-qr.png",
}: {
  value: string;
  size?: number;
  caption?: string;
  fileName?: string;
}) {
  const [open, openIt, close] = useEnlarge();
  const wrapRef = useRef<HTMLDivElement>(null);

  function save() {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  }

  return (
    <>
      <button
        onClick={openIt}
        aria-label="Enlarge QR code"
        className="rounded-2xl bg-white p-2.5 transition-transform active:scale-95"
      >
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#ffffff"
          fgColor="#0f1115"
          level="H"
          imageSettings={{
            src: "/logo-orange.svg",
            height: Math.round(size * 0.32),
            width: Math.round(size * 0.32),
            excavate: true,
          }}
        />
      </button>

      <Modal open={open} onClose={close}>
        <div className="flex w-[300px] max-w-[86vw] flex-col items-center gap-4">
          <div ref={wrapRef} className="rounded-3xl bg-white p-5">
            <QRCodeCanvas
              value={value}
              size={240}
              bgColor="#ffffff"
              fgColor="#0f1115"
              level="H"
              imageSettings={{
                src: "/logo-orange.svg",
                height: 78,
                width: 78,
                excavate: true,
              }}
            />
          </div>
          {caption && (
            <p className="max-w-[260px] break-all text-center font-mono text-[11px] text-muted">
              {caption}
            </p>
          )}
          <Button onClick={save} leftIcon={<Download className="size-4" />}>
            Save image
          </Button>
        </div>
      </Modal>
    </>
  );
}
