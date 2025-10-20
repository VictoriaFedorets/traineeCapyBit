// videosOperations.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@services/apiConfig";
import { toast } from "react-toastify";
import axios from "axios";
import {
  VideoData,
  AddVideoPayload,
  UpdateVideoPayload,
  AddCommentPayload,
  AddCommentResponse,
  FetchCommentsResponse,
  FetchCommentsPayload,
  ToggleLikeResponse,
  ToggleLikePayload,
} from "./types";

// GET /video/all
export const loadVideos = createAsyncThunk<
  VideoData[],
  void,
  { rejectValue: string }
>("videos/loadAll", async (_, thunkAPI) => {
  try {
    const { data } = await api.get<VideoData[]>("/video/all");
    return data;
  } catch (error: unknown) {
    let message = "Failed to load videos";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// GET /video/:id
export const fetchVideoById = createAsyncThunk<
  VideoData,
  number,
  { rejectValue: string }
>("videos/fetchById", async (id, thunkAPI) => {
  try {
    const { data } = await api.get<VideoData>(`/video/${id}`);
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch video";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// POST /video/add
export const addVideo = createAsyncThunk<
  VideoData,
  AddVideoPayload,
  { rejectValue: string }
>("videos/add", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post<VideoData>("/video/add", payload);
    toast.success("Video added successfully");
    return data;
  } catch (error: unknown) {
    let message = "Failed to add video";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// PUT /video/update/:id
export const updateVideo = createAsyncThunk<
  VideoData,
  UpdateVideoPayload,
  { rejectValue: string }
>("videos/update", async (payload, thunkAPI) => {
  try {
    const { id, ...rest } = payload;
    const { data } = await api.put<VideoData>(`/video/update/${id}`, rest);
    toast.success("Video updated successfully");
    return data;
  } catch (error: unknown) {
    let message = "Failed to update video";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// DELETE /video/remove/:id
export const deleteVideo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("videos/delete", async (id, thunkAPI) => {
  try {
    const { data } = await api.delete<{ id: number }>(`/video/remove/${id}`);
    toast.success("Video deleted successfully");
    return data.id ?? id;
  } catch (error: unknown) {
    let message = "Failed to delete video";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// GET /video/:id/allComments
export const fetchCommentsByVideo = createAsyncThunk<
  FetchCommentsResponse,
  FetchCommentsPayload,
  { rejectValue: string }
>("videos/fetchComments", async ({ videoId }, thunkAPI) => {
  try {
    const { data } = await api.get<FetchCommentsResponse>(
      `/video/${videoId}/allComments`
    );
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch comments";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// POST /video/:id/comment
export const addCommentToVideo = createAsyncThunk<
  AddCommentResponse,
  AddCommentPayload,
  { rejectValue: string }
>("videos/addComment", async ({ videoId, text }, thunkAPI) => {
  try {
    const { data } = await api.post<AddCommentResponse>(
      `/video/${videoId}/comment`,
      { text }
    );
    // console.log("Server response:", data);
    toast.success("Comment add successfully");
    return data;
  } catch (error: unknown) {
    let message = "Failed to add comment";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const toggleLikeVideo = createAsyncThunk<
  ToggleLikeResponse,
  ToggleLikePayload,
  { rejectValue: string }
>("videos/toggleLike", async ({ videoId }, thunkAPI) => {
  try {
    const { data } = await api.post<ToggleLikeResponse>(
      `/video/${videoId}/like`,
      {}
    );
    return data;
  } catch (error: unknown) {
    let message = "Failed to toggle like";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchLikesCount = createAsyncThunk<
  { videoId: number; likes: number },
  { videoId: number },
  { rejectValue: string }
>("videos/fetchLikesCount", async ({ videoId }, thunkAPI) => {
  try {
    const { data } = await api.get(`/video/${videoId}/likes`);
    return { videoId, likes: data.likes };
  } catch (error: unknown) {
    let message = "Failed to fetch likes count";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

// POST /video/:id/view
// videosOperations.ts
export const addVideoView = createAsyncThunk<
  { videoId: number; views: number },
  { videoId: number },
  { rejectValue: string }
>("videos/addView", async ({ videoId }, thunkAPI) => {
  try {
    const { data } = await api.post<{ videoId: number; views: number }>(
      `/video/${videoId}/view`
    );
    return data; // { videoId, views }
  } catch (error: unknown) {
    let message = "Failed to add view";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});
