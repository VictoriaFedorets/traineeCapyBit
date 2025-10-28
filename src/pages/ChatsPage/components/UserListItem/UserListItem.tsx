import css from "./UserListItem.module.css";
import type { User } from "@redux/chats/types";

type UserListItemProps = {
  user: User;
  isHighlighted: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export default function UserListItem({
  user,
  isHighlighted,
  onSelect,
  onHover,
}: UserListItemProps) {
  return (
    <li
      className={`${css.resultItem} ${isHighlighted ? css.highlight : ""}`}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <img
        src={user.avatarUrl || "/default-avatar.png"}
        alt={user.name}
        className={css.avatar}
      />
      <span>{user.name}</span>
    </li>
  );
}
