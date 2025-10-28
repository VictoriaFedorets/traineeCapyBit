export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  participants: User[];
  otherUser?: User;
  lastMessage?: Message;
  createdAt: string;
}

export interface ChatsState {
  users: User[];
  chats: Chat[];
  messages: Message[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
}
