import { RootState } from "../store";

export const selectUser = (state: RootState) => state.user.user;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectAuthStatus = (state: RootState) => state.user.status;
export const selectAuthError = (state: RootState) => state.user.error;
export const selectAuthLoading = (state: RootState) =>
  state.user.status === "loading";

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
