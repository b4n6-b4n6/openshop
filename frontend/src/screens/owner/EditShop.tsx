import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AppFrame } from "../../app/AppFrame";
import { Input, TextArea } from "../../components/ui/Input";
import { PhotoField } from "../../components/ui/PhotoField";
import { Button } from "../../components/ui/Button";
import { useSession } from "../../app/providers/SessionProvider";
import { updateShop } from "../../api/shops";
import { useToast } from "../../app/providers/ToastProvider";
import { errorMessage } from "../../lib/errors";

export function EditShop() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ownerShop, setOwnerShop } = useSession();
  const [name, setName] = useState(ownerShop?.name ?? "");
  const [description, setDescription] = useState(ownerShop?.description ?? "");
  const [profilePhoto, setProfilePhoto] = useState(ownerShop?.profilePhoto);
  const [bannerPhoto, setBannerPhoto] = useState(ownerShop?.bannerPhoto);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  if (!ownerShop) {
    navigate("/welcome", { replace: true });
    return null;
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await updateShop({
        ...ownerShop!, name, description, profilePhoto, bannerPhoto,
      });
      setOwnerShop(updated);
      await queryClient.invalidateQueries({ queryKey: ["shop"] });
      navigate(-1);
    } catch (error) {
      push(errorMessage(error, "The shop could not be updated."), "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppFrame
      title="Edit Shop"
      back
      bottomBar={<Button loading={saving} onClick={() => void save()}>Update</Button>}
    >
      <div className="space-y-5 px-5 py-6">
        <Input
          label="Shop name"
          placeholder="My Shop"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          label="Shop description"
          placeholder="Describe your shop… (markdown supported)"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <PhotoField
          label="Profile photo"
          value={profilePhoto}
          onChange={setProfilePhoto}
        />
        <PhotoField
          label="Banner photo"
          aspect="banner"
          value={bannerPhoto}
          onChange={setBannerPhoto}
        />
      </div>
    </AppFrame>
  );
}
