import { useDM } from "../context/dm-context";
import { ChatWindow } from "./chat-window";

export function ChatWindowsContainer() {
  const { openChats } = useDM();
  return (
    <>
      {openChats.map((chat, i) => (
        <ChatWindow
          key={chat.username}
          peerUsername={chat.username}
          peerDisplayName={chat.displayName}
          peerColor={chat.profileColor}
          index={i}
        />
      ))}
    </>
  );
}
