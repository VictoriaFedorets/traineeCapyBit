import { RootState } from "../store";

export const selectUsers = (state: RootState) => state.chats.users;

export const selectChats = (state: RootState) => state.chats.chats;

export const selectMessages = (state: RootState) => state.chats.messages;

export const selectCurrentChat = (state: RootState) => state.chats.currentChat;
export const selectIsLoading = (state: RootState) => state.chats.loading;
export const selectError = (state: RootState) => state.chats.error;
