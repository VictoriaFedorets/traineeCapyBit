// utils/youtube.ts
export const getYouTubeVideoId = (url: string): string => {
  try {
    if (url.includes("youtube.com")) {
      return new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtu.be")) {
      const path = new URL(url).pathname;
      return path.split("/")[1] || "";
    }
    return "";
  } catch {
    return "";
  }
};

export const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/placeholder.png";
};
