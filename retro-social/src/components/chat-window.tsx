import { useEffect, useRef, useState } from "react";
import { useGetConversation, useSendMessage, useMarkRead } from "@workspace/api-client-react";
import { useDM } from "../context/dm-context";
import { useSession } from "../hooks/use-session";

interface Props {
  peerUsername: string;
  peerDisplayName: string;
  peerColor?: string | null;
  index: number;
}

export function ChatWindow({ peerUsername, peerDisplayName, peerColor, index }: Props) {
  const { closeChat } = useDM();
  const { user } = useSession();
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const myUsername = user?.username ?? "";

  const { data: messages = [], refetch } = useGetConversation(myUsername, peerUsername, {
    query: {
      refetchInterval: 4000,
      enabled: !!myUsername,
    },
  });

  const markRead = useMarkRead();
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (!minimized && myUsername && messages.length > 0) {
      markRead.mutate({ username: myUsername, otherUsername: peerUsername });
    }
  }, [messages.length, minimized, myUsername]);

  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, minimized]);

  const handleSend = () => {
    if (!input.trim() || !myUsername) return;
    sendMessage.mutate(
      { username: myUsername, otherUsername: peerUsername, data: { message: input.trim() } },
      { onSuccess: () => { refetch(); setInput(""); } }
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const accentColor = peerColor ?? "#ff00ff";
  const right = 20 + index * 340;

  const unreadCount = messages.filter(m => m.toUsername === myUsername && !m.readAt).length;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right,
        width: 320,
        zIndex: 1000,
        fontFamily: "'VT323', monospace",
        boxShadow: `0 0 20px ${accentColor}88, 0 0 40px ${accentColor}44`,
        border: `2px solid ${accentColor}`,
        background: "#0a0a1a",
      }}
    >
      <div
        style={{
          background: accentColor,
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setMinimized(m => !m)}
      >
        <span style={{ color: "#0a0a1a", fontWeight: "bold", fontSize: "1rem" }}>
          {unreadCount > 0 && !minimized ? null : null}
          IM: {peerDisplayName}
          {unreadCount > 0 && minimized && (
            <span style={{ marginLeft: 8, background: "#ff0000", color: "#fff", borderRadius: 2, padding: "0 4px" }}>
              {unreadCount} new
            </span>
          )}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "none",
              color: "#0a0a1a",
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "0 6px",
              lineHeight: 1.2,
            }}
            onClick={e => { e.stopPropagation(); setMinimized(m => !m); }}
            title={minimized ? "Restore" : "Minimize"}
          >
            {minimized ? "□" : "_"}
          </button>
          <button
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "none",
              color: "#0a0a1a",
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "0 6px",
              lineHeight: 1.2,
            }}
            onClick={e => { e.stopPropagation(); closeChat(peerUsername); }}
            title="Close"
          >
            X
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div
            style={{
              height: 280,
              overflowY: "auto",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              background: "#05050f",
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: "#555", fontSize: "0.9rem", textAlign: "center", marginTop: 40 }}>
                no messages yet. say hi! :-D
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.fromUsername === myUsername;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#666", marginBottom: 2 }}>
                    <span style={{ color: isMe ? "#00ffff" : accentColor }}>
                      {msg.fromUsername}
                    </span>
                    {" "}
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "4px 8px",
                      background: isMe ? "#001a1a" : "#1a001a",
                      border: `1px solid ${isMe ? "#00ffff44" : accentColor + "44"}`,
                      color: isMe ? "#00ffff" : "#ffffff",
                      fontSize: "0.95rem",
                      wordBreak: "break-word",
                      lineHeight: 1.3,
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${accentColor}44` }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="type a message..."
              maxLength={1000}
              style={{
                flex: 1,
                background: "#0a0a1a",
                border: "none",
                color: "#fff",
                fontFamily: "'VT323', monospace",
                fontSize: "1rem",
                padding: "6px 8px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              style={{
                background: accentColor,
                border: "none",
                color: "#0a0a1a",
                fontFamily: "'VT323', monospace",
                fontSize: "1rem",
                padding: "0 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              SEND
            </button>
          </div>
        </>
      )}
    </div>
  );
}
