import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  fetchUsersToChat,
  startChat,
  fetchUserChats,
} from "redux/chats/operations";
import {
  selectUsers,
  selectIsLoading,
  selectChats,
} from "redux/chats/selectors";
import UserListItem from "../UserListItem/UserListItem";
import ChatsList from "../ChatsList/ChatsList";
import css from "./SearchUsers.module.css";
import type { Chat, User } from "redux/chats/types";

interface SearchUsersProps {
  onSelectUser: (chat: Chat) => void;
}

export default function SearchUsers({ onSelectUser }: SearchUsersProps) {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectUsers);
  const isLoading = useAppSelector(selectIsLoading);
  const chats = useAppSelector(selectChats);

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsersToChat());
    dispatch(fetchUserChats());
  }, [dispatch]);

  const filteredResults = results.filter((user: User) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectUser = async (user: User) => {
    const chat = await dispatch(startChat(user.id)).unwrap();
    onSelectUser(chat);
    setQuery("");
  };

  return (
    <div className={css.searchWrapper}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={css.input}
        placeholder="Search user..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
      />

      <div className={css.resultsContainer}>
        {isLoading && <p className={css.loading}>Loading...</p>}

        {query ? (
          filteredResults.length > 0 ? (
            <ul className={css.resultsList}>
              {filteredResults.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onSelect={() => handleSelectUser(user)}
                />
              ))}
            </ul>
          ) : (
            <p className={css.noResults}>No users found</p>
          )
        ) : (
          <ChatsList chats={chats} onSelectChat={onSelectUser} />
        )}
      </div>
    </div>
  );
}
