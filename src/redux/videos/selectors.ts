import { RootState } from "../store";

export const selectVideos = (state: RootState) => state.videos.items;
export const selectVideoById = (id: number) => (state: RootState) =>
  state.videos.items.find((video) => video.id === id);

export const selectStatus = (state: RootState) => state.videos.status;

export const selectCommentsByVideoId =
  (videoId: number) => (state: RootState) => {
    const video = state.videos.items.find((video) => video.id === videoId);
    return video?.comments || [];
  };
