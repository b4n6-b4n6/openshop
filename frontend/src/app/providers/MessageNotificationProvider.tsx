import { useEffect, useRef, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { listChats } from "../../api/chat";
import { playMessageTing, primeNotificationAudio } from "../../lib/notificationSound";
import { useSession } from "./SessionProvider";
import { useToast } from "./ToastProvider";

export function MessageNotificationProvider({ children }: { children: ReactNode }) {
  const { role } = useSession();
  const { push } = useToast();
  const latestByChat = useRef(new Map<string, number>());
  const initialized = useRef(false);
  const soundWarningShown = useRef(false);
  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: listChats,
    enabled: role !== "none",
    refetchInterval: 3_000,
  });

  useEffect(() => {
    latestByChat.current.clear();
    initialized.current = false;
  }, [role]);

  useEffect(() => {
    const prime = () => {
      void primeNotificationAudio().catch((error) => {
        console.warn("Could not enable notification audio", error);
      });
    };
    window.addEventListener("pointerdown", prime, { once: true });
    window.addEventListener("keydown", prime, { once: true });
    return () => {
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("keydown", prime);
    };
  }, []);

  useEffect(() => {
    if (!data || role === "none") return;

    const hasNewIncoming = initialized.current && data.some((chat) => (
      chat.lastMessageFrom !== undefined
      && chat.lastMessageFrom !== role
      && chat.lastMessageAt > (latestByChat.current.get(chat.id) ?? 0)
    ));

    data.forEach((chat) => latestByChat.current.set(chat.id, chat.lastMessageAt));
    initialized.current = true;

    if (hasNewIncoming) {
      void playMessageTing().catch((error) => {
        console.warn("Could not play message notification", error);
        if (!soundWarningShown.current) {
          soundWarningShown.current = true;
          push("A new message arrived, but notification audio is blocked.", "warning");
        }
      });
    }
  }, [data, push, role]);

  return children;
}
