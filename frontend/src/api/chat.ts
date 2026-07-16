import { requestJson } from "./client";
import type { Chat, Message } from "./types";

export async function listChats(): Promise<Chat[]> {
  return requestJson<Chat[]>("/chats");
}

export async function getMessages(chatId: string): Promise<Message[]> {
  return requestJson<Message[]>(`/chats/${encodeURIComponent(chatId)}/messages`);
}

export async function sendMessage(
  chatId: string,
  from: "owner" | "customer",
  payload: { type: "text"; text: string } | { type: "image"; media: string },
): Promise<Message> {
  return requestJson<Message>(`/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ ...payload, from }),
  });
}
