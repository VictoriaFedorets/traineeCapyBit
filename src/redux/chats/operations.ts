import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "@services/apiConfig";
import { toast } from "react-toastify";
import { User, Chat, Message } from "./types";

// 🔹 Универсальная обработка ошибок
const handleError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  return defaultMessage;
};

// 🔹 Получить всех пользователей для начала чата
export const fetchUsersToChat = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("chats/fetchUsersToChat", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<User[]>("/chats/users");
    return data;
  } catch (error: unknown) {
    const message = handleError(error, "Failed to load users");
    toast.error(message);
    return rejectWithValue(message);
  }
});

// 🔹 Получить список всех чатов текущего пользователя
export const fetchUserChats = createAsyncThunk<
  Chat[],
  void,
  { rejectValue: string }
>("chats/fetchUserChats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Chat[]>("/chats/chats");
    return data;
  } catch (error: unknown) {
    const message = handleError(error, "Failed to load chats");
    toast.error(message);
    return rejectWithValue(message);
  }
});

// 🔹 Создать (начать) чат с пользователем
export const startChat = createAsyncThunk<
  Chat,
  number,
  { rejectValue: string }
>("chats/startChat", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Chat>(`/chats/start/${userId}`);
    toast.success("Chat created");
    return data;
  } catch (error: unknown) {
    const message = handleError(error, "Failed to create chat");
    toast.error(message);
    return rejectWithValue(message);
  }
});

// 🔹 Получить сообщения чата
export const fetchMessages = createAsyncThunk<
  Message[],
  number,
  { rejectValue: string }
>("chats/fetchMessages", async (chatId, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Message[]>(`/chats/${chatId}/messages`);
    return data;
  } catch (error: unknown) {
    const message = handleError(error, "Error loading messages");
    toast.error(message);
    return rejectWithValue(message);
  }
});

// 🔹 Отправить сообщение
export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async (
    {
      chatId,
      content,
      senderId,
    }: { chatId: number; content: string; senderId: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(`/chats/${chatId}/sentMessage`, {
        content: content,
        senderId,
      });
      return data;
    } catch (error: unknown) {
      const message = handleError(error, "Failed to send the message");
      return rejectWithValue(message);
    }
  }
);

export const searchUsers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>("chats/searchUsers", async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.get<User[]>(`/chats/search?query=${query}`);
    return data;
  } catch (error: unknown) {
    const message = handleError(error, "Failed to search users");
    toast.error(message);
    return rejectWithValue(message);
  }
});
