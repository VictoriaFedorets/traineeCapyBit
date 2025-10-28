import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchMessages, sendMessage } from "redux/chats/operations";
import type { Chat, Message } from "@redux/chats/types";
import { selectUser } from "redux/user/selectors";
import ChatInput from "../ChatInput/ChatInput";
import css from "./ChatWindow.module.css";

interface ChatWindowProps {
  chat: Chat;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const otherUser = chat.participants.find(
    (p) => p.id !== Number(currentUser?.id)
  );

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await dispatch(fetchMessages(chat.id)).unwrap();
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, [chat.id, dispatch]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser) return;

    try {
      const newMessage = await dispatch(
        sendMessage({
          chatId: chat.id,
          content: input,
          senderId: +currentUser.id,
        })
      ).unwrap();

      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className={css.chatWindow}>
      <div className={css.header}>
        <h4>{otherUser?.name || "User"}</h4>
      </div>

      <div className={css.messages} ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${css.message} ${
              msg.senderId === Number(currentUser?.id) ? css.own : ""
            }`}
          >
            <span>{msg.content}</span>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
}
