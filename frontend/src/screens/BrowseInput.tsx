import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { AppFrame } from "../app/AppFrame";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { QRScanner } from "../components/ui/QRScanner";

/** Pull an onion address out of a scanned value (handles bare address or URL). */
function extractOnion(raw: string): string {
  const value = raw.trim();
  const match = value.match(/([a-z2-7]{16,}\.onion)/i);
  return match ? match[1] : value.replace(/^[a-z]+:\/\//i, "");
}

export function BrowseInput() {
  const navigate = useNavigate();
  const [onion, setOnion] = useState("");
  const [error, setError] = useState<string>();
  const [scanning, setScanning] = useState(false);

  function onEnter() {
    const value = onion.trim();
    if (!value) {
      setError("Enter a shop address");
      return;
    }
    navigate("/browse/connecting", { state: { onion: value } });
  }

  const onScanResult = useCallback(
    (value: string) => {
      setScanning(false);
      navigate("/browse/connecting", { state: { onion: extractOnion(value) } });
    },
    [navigate],
  );

  return (
    <AppFrame
      title="Browse Shop"
      back="/welcome"
      bottomBar={<Button onClick={onEnter}>Enter</Button>}
    >
      <div className="space-y-5 px-5 py-6">
        <p className="text-[14px] text-muted">
          Paste the shop&apos;s onion address to connect over Tor, or scan its QR code.
        </p>
        <Input
          label="Shop address"
          placeholder="xxxxxxxx…onion"
          mono
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={onion}
          error={error}
          onChange={(e) => {
            setOnion(e.target.value);
            if (error) setError(undefined);
          }}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
        />
        <Button
          variant="secondary"
          leftIcon={<QrCode className="size-4" />}
          onClick={() => setScanning(true)}
        >
          Scan QR code
        </Button>
      </div>

      <QRScanner
        open={scanning}
        onClose={() => setScanning(false)}
        onResult={onScanResult}
      />
    </AppFrame>
  );
}
