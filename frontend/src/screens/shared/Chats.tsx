import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { AppFrame } from "../../app/AppFrame";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { formatRelative, truncateMiddle } from "../../lib/format";
import { listChats } from "../../api/chat";

export function Chats() {
  const { onion } = useParams();
  const navigate = useNavigate();
  const base = onion ? `/s/${onion}/chats` : "/shop/chats";
  const back = onion ? `/s/${onion}` : "/shop";

  const { data, isLoading } = useQuery({ queryKey: ["chats"], queryFn: listChats });

  return (
    <AppFrame title="Chats" back={back}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="size-8" />}
          title="No chats yet"
          description="Conversations with customers appear here."
        />
      ) : (
        <div className="flex flex-col gap-2.5 px-5 py-5">
          {data.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`${base}/${encodeURIComponent(chat.id)}`)}
              className="text-left"
            >
              <Card className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-muted">
                  <MessageSquare className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[13px] text-text">
                    {truncateMiddle(chat.id, 10, 6)}
                  </p>
                  <p className="text-[12px] text-faint">
                    {formatRelative(chat.lastMessageAt)}
                  </p>
                </div>
                {chat.unread && <span className="size-2.5 rounded-full bg-accent" />}
              </Card>
            </button>
          ))}
        </div>
      )}
    </AppFrame>
  );
}
