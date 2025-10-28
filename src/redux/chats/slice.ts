import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatsState, Chat, Message, User } from "./types";
import {
  fetchUsersToChat,
  startChat,
  fetchMessages,
  sendMessage,
  fetchUserChats,
  searchUsers,
} from "./operations";

const initialState: ChatsState = {
  users: [], // для поиска пользователей
  chats: [], // список чатов текущего пользователя
  messages: [], // сообщения активного чата
  currentChat: null, // активный чат
  loading: false,
  error: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat | null>) {
      state.currentChat = action.payload;
      state.messages = []; // очищаем сообщения при смене чата
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // 🔹 Поиск пользователей
    builder
      .addCase(fetchUsersToChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersToChat.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      })
      .addCase(fetchUsersToChat.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })

      // 🔹 Создать / открыть чат
      .addCase(startChat.fulfilled, (state, { payload }) => {
        // добавляем чат в список если его ещё нет
        const exists = state.chats.find((c) => c.id === payload.id);
        if (!exists) state.chats.push(payload);
        state.currentChat = payload; // сразу открываем
        state.messages = [];
      })

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload;
      })
      .addCase(fetchMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })

      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.messages.push(payload);
      })

      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      })
      .addCase(searchUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      });
  },
});

export const { setCurrentChat, clearMessages } = chatsSlice.actions;
export default chatsSlice.reducer;
