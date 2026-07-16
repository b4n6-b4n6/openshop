import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Send } from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { ChatBubble } from "../../components/ui/ChatBubble";
import { ImageViewer } from "../../components/ui/ImageViewer";
import { IconButton } from "../../components/ui/IconButton";
import { Spinner } from "../../components/ui/Spinner";
import { getMessages, sendMessage } from "../../api/chat";
import { ErrorNotice } from "../../components/ui/ErrorNotice";
import { useToast } from "../../app/providers/ToastProvider";
import { errorMessage } from "../../lib/errors";

export function Chat() {
  const { id = "" } = useParams();
  const location = useLocation();
  const chatId = decodeURIComponent(id);
  const owner = location.pathname.startsWith("/shop/");
  const me = owner ? "owner" : "customer";
  const back = owner ? "/shop/chats" : "/chats";

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
    refetchInterval: 3_000,
  });

  const [text, setText] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
  }

  async function onSendText() {
    const value = text.trim();
    if (!value || sending) return;
    setText("");
    setSending(true);
    try {
      await sendMessage(chatId, me, { type: "text", text: value });
      await refresh();
    } catch (sendError) {
      setText(value);
      push(errorMessage(sendError, "The message could not be sent."), "danger");
    } finally {
      setSending(false);
    }
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setSending(true);
      try {
        await sendMessage(chatId, me, { type: "image", media: String(reader.result) });
        await refresh();
      } catch (sendError) {
        push(errorMessage(sendError, "The image could not be sent."), "danger");
      } finally {
        setSending(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.onerror = () => {
      push("The selected image could not be read.", "danger");
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppFrame
      title={chatId}
      back={back}
      bottomBar={
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendText()}
            placeholder="Text message"
            className="h-11 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text placeholder:text-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <IconButton label="Send image" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="size-5" />
          </IconButton>
          <button
            aria-label="Send text"
            onClick={onSendText}
            disabled={!text.trim() || sending}
            className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <ErrorNotice error={error} title="Couldn't load messages" onRetry={() => void refetch()} />
      ) : (
        <div className="flex flex-col gap-2.5 px-4 py-5">
          {data?.map((m) => (
            <ChatBubble key={m.id} message={m} me={me} onImageClick={setViewing} />
          ))}
        </div>
      )}

      <ImageViewer
        src={viewing ?? ""}
        open={viewing !== null}
        onClose={() => setViewing(null)}
      />
    </AppFrame>
  );
}
