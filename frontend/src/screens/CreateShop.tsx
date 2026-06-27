import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "../app/AppFrame";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import type { WalletInput } from "../api/types";

export function CreateShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState<WalletInput>({
    primaryAddress: "",
    privateViewKey: "",
    restoreHeight: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WalletInput, string>>>({});

  function set<K extends keyof WalletInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onCreate() {
    const next: typeof errors = {};
    if (!form.primaryAddress.trim()) next.primaryAddress = "Required";
    if (!form.privateViewKey.trim()) next.privateViewKey = "Required";
    if (!form.restoreHeight.trim()) next.restoreHeight = "Required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    navigate("/create/opening", { state: { input: form } });
  }

  return (
    <AppFrame
      title="Open New Shop"
      back="/welcome"
      bottomBar={<Button onClick={onCreate}>Create</Button>}
    >
      <div className="space-y-5 px-5 py-6">
        <p className="text-[14px] text-muted">
          Import a <span className="text-text">view-only</span> Monero wallet. Your spend key
          never leaves your device.
        </p>
        <Input
          label="Monero wallet primary address"
          placeholder="4…"
          mono
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={form.primaryAddress}
          error={errors.primaryAddress}
          onChange={(e) => set("primaryAddress", e.target.value)}
        />
        <Input
          label="Private view key"
          placeholder="secret view key"
          mono
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={form.privateViewKey}
          error={errors.privateViewKey}
          onChange={(e) => set("privateViewKey", e.target.value)}
        />
        <Input
          label="Restore block height"
          placeholder="e.g. 3155600"
          inputMode="numeric"
          value={form.restoreHeight}
          error={errors.restoreHeight}
          onChange={(e) => set("restoreHeight", e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>
    </AppFrame>
  );
}
