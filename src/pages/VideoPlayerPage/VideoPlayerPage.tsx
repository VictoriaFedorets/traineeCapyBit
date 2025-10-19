import VideoPlayer from "@pages/VideoPlayerPage/components/VideoPlayer/VideoPlayer";
import { useLocation } from "react-router-dom";
import { VideoData } from "redux/videos/types";
import CommentsSection from "@pages/VideoPlayerPage/components/CommentsSection/CommentsSection";

export default function VideoPlayerPage() {
  const location = useLocation();
  const video = location.state as VideoData;

  return (
    <>
      <VideoPlayer
        src={video.url}
        name={video.name}
        id={video.id}
        poster={video.poster}
      />

      <CommentsSection videoId={video.id} />
    </>
  );
}
