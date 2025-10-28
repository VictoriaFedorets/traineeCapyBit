import css from "./ChatsPage.module.css";
import SearchUsers from "./components/SearchUsers/SearchUsers";
import ChatsList from "./components/ChatsList/ChatsList";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { useState } from "react";
import { Chat } from "@redux/chats/types";

export default function ChatsPage() {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const isChatOpen = !!currentChat;

  const handleSelectChat = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const handleCloseChat = () => {
    setCurrentChat(null);
  };

  return (
    <section className={css.containerChats}>
      <div className={css.headerChats}>
        <h3>Chats</h3>
        {currentChat && (
          <button
            className={css.backButton}
            onClick={() => setCurrentChat(null)}
          >
            ← Back
          </button>
        )}
      </div>

      <div className={`${css.chatLayout} ${currentChat ? css.showChat : ""}`}>
        <aside className={css.sidebar}>
          <SearchUsers onSelectUser={setCurrentChat} />
          <ChatsList onSelectChat={setCurrentChat} />
        </aside>

        <div className={css.chatWindow}>
          {currentChat ? (
            <ChatWindow chat={currentChat} />
          ) : (
            <div className={css.emptyChat}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
