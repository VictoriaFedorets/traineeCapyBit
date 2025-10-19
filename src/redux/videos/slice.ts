import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loadVideos,
  fetchVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  addCommentToVideo,
  fetchCommentsByVideo,
  toggleLikeVideo,
  fetchLikesCount,
} from "./operations";
import { logout } from "../user/userOperations";
import { FetchCommentsResponse, VideoData, VideosState } from "./types";

const initialState: VideosState = {
  items: [],
  status: "idle",
  error: null,
};

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    clearVideos: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // load all
      .addCase(loadVideos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loadVideos.fulfilled,
        (state, action: PayloadAction<VideoData[]>) => {
          state.items = action.payload;
          state.status = "idle";
        }
      )
      .addCase(loadVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error loading videos";
      })

      // fetchVideoById
      .addCase(
        fetchVideoById.fulfilled,
        (state, action: PayloadAction<VideoData>) => {
          const idx = state.items.findIndex(
            (video) => video.id === action.payload.id
          );
          if (idx === -1) state.items.unshift(action.payload);
          else state.items[idx] = action.payload;
        }
      )

      // add video
      .addCase(addVideo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addVideo.fulfilled,
        (state, action: PayloadAction<VideoData>) => {
          state.items.unshift(action.payload);
          state.status = "idle";
        }
      )
      .addCase(addVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error adding video";
      })

      // update video
      .addCase(updateVideo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateVideo.fulfilled,
        (state, action: PayloadAction<VideoData>) => {
          state.items = state.items.map((video) =>
            video.id === action.payload.id ? action.payload : video
          );
          state.status = "idle";
        }
      )
      .addCase(updateVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error updating video";
      })

      // delete video
      .addCase(deleteVideo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteVideo.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            (video) => video.id !== action.payload
          );
          state.status = "idle";
        }
      )
      .addCase(deleteVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error deleting video";
      })

      // Toggle like
      .addCase(toggleLikeVideo.fulfilled, (state, action) => {
        const { videoId, liked, likes } = action.payload;
        console.log(action.payload);
        const video = state.items.find((v) => v.id === videoId);
        if (video) {
          video.liked = liked;
          video.likes = likes;
        }
      })

      // Fetch like
      .addCase(fetchLikesCount.fulfilled, (state, action) => {
        const { videoId, likes } = action.payload;
        const video = state.items.find((v) => v.id === videoId);
        if (video) {
          video.likes = likes;
        }
      })

      // Fetch comments
      .addCase(
        fetchCommentsByVideo.fulfilled,
        (state, action: PayloadAction<FetchCommentsResponse>) => {
          const video = state.items.find(
            (v) => v.id === action.payload.videoId
          );
          if (video) {
            video.comments = action.payload.comments.map((c) => ({
              ...c,
              user: c.user ?? { id: c.userId ?? 0, name: "Unknown" },
            }));
          }
        }
      )

      // Add comment
      .addCase(addCommentToVideo.fulfilled, (state, action) => {
        const newComment = action.payload;
        const video = state.items.find((v) => v.id === newComment.videoId);

        if (video) {
          const updatedComments = [
            {
              ...newComment,
              user: newComment.user ?? { id: 0, name: "Anonymous" },
            },

            ...(video.comments || []),
          ];

          video.comments = updatedComments;
        }
      })

      .addCase(logout.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default videosSlice.reducer;
