import { VideoData } from "redux/videos/types";

const LS_KEY = "videoData";

export const getVideos = () => {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? (JSON.parse(data) as VideoData[]) : [];
  } catch (err) {
    console.error("Error reading local storage", err);
    return [];
  }
};

export const setVideos = (videos: VideoData[]): void => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(videos));
  } catch (err) {
    console.error("Error writing to local storage", err);
  }
};
