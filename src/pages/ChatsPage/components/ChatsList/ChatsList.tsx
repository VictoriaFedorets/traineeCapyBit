import { useState, useEffect } from "react";
import type { Chat, Participant } from "@redux/chats/types";
import UserListItem from "../UserListItem/UserListItem";
import { useAppDispatch, useAppSelector } from "@redux/hooks.ts";
import { fetchUserChats } from "@redux/chats/operations.ts";
import css from "./ChatsList.module.css";

type ChatsListProps = {
  onSelectChat: (chat: Chat) => void;
};

export default function ChatsList({ onSelectChat }: ChatsListProps) {
  const dispatch = useAppDispatch();
  const { chats, loading } = useAppSelector((state) => state.chats);
  const currentUser = useAppSelector((state) => state.user.user);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUserChats());
  }, [dispatch]);

  if (loading) return <div>Loading chats...</div>;
  if (!chats.length) return <div>No chats yet</div>;

  // Формируем список только с другим участником
  const existingChats = chats
    .map((chat) => {
      const otherUser = chat.participants.find(
        (p: Participant) => p.id !== Number(currentUser?.id)
      );
      if (!otherUser) return null;
      return { ...chat, otherUser };
    })
    .filter(Boolean) as (Chat & { otherUser: Participant })[];

  return (
    <ul className={css.chatsList}>
      {existingChats.map((chat, index) => (
        <UserListItem
          key={chat.id}
          user={chat.otherUser}
          isHighlighted={highlightedIndex === index}
          onSelect={() => onSelectChat(chat)}
          onHover={() => setHighlightedIndex(index)}
        />
      ))}
    </ul>
  );
}
