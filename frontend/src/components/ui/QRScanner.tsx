import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Minimal typings for the native BarcodeDetector (not in TS DOM lib yet).
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}
type BarcodeDetectorCtor = new (opts?: {
  formats?: string[];
}) => BarcodeDetectorLike;

const UNSUPPORTED =
  "QR scanning isn't supported in this browser. Paste the address instead.";

/**
 * Fullscreen QR scanner using the camera + the native BarcodeDetector API.
 * No external dependency. Falls back to a message where unsupported.
 */
export function QRScanner({
  open,
  onClose,
  onResult,
}: {
  open: boolean;
  onClose: () => void;
  onResult: (value: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>();

  const Ctor = useMemo(
    () =>
      (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector,
    [],
  );

  useEffect(() => {
    if (!open || !Ctor) return;

    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    const detector = new Ctor({ formats: ["qr_code"] });

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const video = videoRef.current;
        if (stopped || !video) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        setError(undefined);

        const tick = async () => {
          if (stopped || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0 && codes[0].rawValue) {
              onResult(codes[0].rawValue);
              return;
            }
          } catch {
            /* transient per-frame decode error — keep scanning */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setError("Camera access denied or unavailable.");
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [open, Ctor, onResult]);

  const message = !Ctor ? UNSUPPORTED : error;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] text-white">
            <span className="text-[15px] font-semibold">Scan shop QR</span>
            <button
              onClick={onClose}
              aria-label="Close scanner"
              className="inline-flex size-10 items-center justify-center rounded-xl hover:bg-white/10"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="relative flex-1">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="size-56 rounded-2xl border-2 border-white/80" />
            </div>
            {message && (
              <div className="absolute inset-x-0 bottom-12 px-8 text-center text-[14px] text-white">
                {message}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
