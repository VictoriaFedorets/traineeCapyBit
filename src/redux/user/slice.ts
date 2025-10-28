import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  register,
  login,
  logout,
  confirmEmail,
  refresh,
  refreshSession,
  resetPassword,
  sendResetPasswordEmail,
} from "./operations";

export interface UserDataProps {
  id: string;
  name: string;
  email: string;
}

export interface UserStateProps {
  user: UserDataProps | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoggedIn: boolean;
}

// Восстанавливаем токены при старте
const savedAccessToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");

const initialState: UserStateProps = {
  user: null,
  accessToken: savedAccessToken,
  refreshToken: savedRefreshToken,
  status: "idle",
  error: null,
  isLoggedIn: !!savedAccessToken,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- logout.fulfilled ---
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "succeeded";
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
    });

    // --- confirmEmail.fulfilled ---
    builder.addCase(confirmEmail.fulfilled, (state) => {
      state.status = "succeeded";
    });

    // --- resetPassword.fulfilled ---
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status = "succeeded";
    });

    // --- sendResetPasswordEmail.fulfilled ---
    builder.addCase(sendResetPasswordEmail.fulfilled, (state) => {
      state.status = "succeeded";
    });

    // --- pending (общий)---
    builder.addMatcher(
      isAnyOf(
        register.pending,
        login.pending,
        logout.pending,
        refresh.pending,
        refreshSession.pending,
        confirmEmail.pending,
        resetPassword.pending,
        sendResetPasswordEmail.pending
      ),
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );

    // --- fulfilled (общий)---
    builder.addMatcher(
      isAnyOf(
        register.fulfilled,
        login.fulfilled,
        refresh.fulfilled,
        refreshSession.fulfilled
      ),
      (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.isLoggedIn = !!action.payload.accessToken;
        // console.log(
        //   "Login fulfilled:",
        //   action.payload,
        //   "isLoggedIn:",
        //   state.isLoggedIn
        // );

        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
    );

    // --- rejected (общий) ---
    builder.addMatcher(
      isAnyOf(
        register.rejected,
        login.rejected,
        logout.rejected,
        refresh.rejected,
        refreshSession.rejected,
        confirmEmail.rejected,
        resetPassword.rejected,
        sendResetPasswordEmail.rejected
      ),
      (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      }
    );
  },
});

export default slice.reducer;
