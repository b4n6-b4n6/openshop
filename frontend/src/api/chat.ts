import { mockDelay } from "./client";
import { nextId, store } from "./mocks/store";
import type { Chat, Message } from "./types";
import { mockChats } from "./mocks/data";

export async function listChats(): Promise<Chat[]> {
  await mockDelay(400);
  return [...mockChats].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

export async function getMessages(chatId: string): Promise<Message[]> {
  await mockDelay(300);
  return store.messages
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function sendMessage(
  chatId: string,
  from: "owner" | "customer",
  payload: { type: "text"; text: string } | { type: "image"; media: string },
): Promise<Message> {
  await mockDelay(250);
  const msg: Message = {
    id: nextId("m"),
    chatId,
    from,
    createdAt: Date.now(),
    ...payload,
  };
  store.messages = [...store.messages, msg];
  return msg;
}
