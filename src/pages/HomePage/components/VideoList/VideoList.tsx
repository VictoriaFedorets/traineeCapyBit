import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { loadVideos } from "redux/videos/operations";
import { selectVideos } from "redux/videos/selectors";
import css from "./VideoList.module.css";
import { VideoData } from "redux/videos/types";
import { useNavigate } from "react-router-dom";
import DeleteVideoBtn from "@pages/HomePage/components/VideoList/DeleteVideoBtn/DeleteVideoBtn";
import InfiniteScrollWrapper from "components/InfiniteScrollWrapper/InfiniteScrollWrapper";
import { usePaginatedList } from "../../../../hooks/usePaginatedList";
import AddVideoBtn from "../AddVideoBtn/AddVideoBtn";
import { selectAccessToken } from "../../../../redux/user/userSelectors";

export default function VideoList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const videos = useAppSelector(selectVideos);
  const token = useAppSelector(selectAccessToken);

  const { visibleItems, showMore, fetchMoreItems, loading, dataLength } =
    usePaginatedList({ items: videos, perPage: 9, delay: 2000 });

  const getYouTubeThumbnail = (url: string) => {
    try {
      let videoId = null;

      if (url.includes("youtube.com")) {
        videoId = new URL(url).searchParams.get("v");
      } else if (url.includes("youtu.be")) {
        const path = new URL(url).pathname;
        videoId = path.split("/")[1];
      }

      return videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  const handleClick = (video: VideoData) => {
    if (video.type === "local" || video.url.endsWith(".mp4")) {
      navigate("/videoPlayer", { state: video });
    } else if (
      video.url.includes("youtube.com") ||
      video.url.includes("youtu.be")
    ) {
      window.open(video.url, "_blank");
    } else {
      window.open(video.url, "_blank");
    }
  };

  useEffect(() => {
    if (!token) return;
    dispatch(loadVideos());
  }, [dispatch, token]);

  return (
    <>
      {visibleItems.length === 0 ? (
        <>
          <h3>Welcome to VideoHub!</h3>
          <p className={css.text}>
            Upload videos, create collections, and share with friends
          </p>
          <AddVideoBtn />
        </>
      ) : (
        <InfiniteScrollWrapper
          dataLength={dataLength}
          hasMore={showMore}
          next={fetchMoreItems}
          loading={loading}
          endMessage={
            videos.length > 6 && (
              <p className={css.showMoreMessage}>You have seen all videos!</p>
            )
          }
        >
          <ul className={css.videoList}>
            {visibleItems.map((video) => (
              <li key={video.id} className={css.videoItem}>
                <div className={css.containerTitle}>
                  <h4 onClick={() => handleClick(video)}>{video.name}</h4>
                  <DeleteVideoBtn id={video.id} />
                </div>

                <div
                  className={css.previewWrapper}
                  onClick={() => handleClick(video)}
                >
                  {video.type === "local" || video.url.endsWith(".mp4") ? (
                    <video
                      preload="metadata"
                      poster={video.poster || "/placeholder.png"}
                      onError={(e) => {
                        e.currentTarget.poster = "/placeholder.png";
                      }}
                    >
                      <source src={video.url} type="video/mp4" />
                    </video>
                  ) : video.url.includes("youtube.com") ||
                    video.url.includes("youtu.be") ? (
                    <img
                      src={getYouTubeThumbnail(video.url)}
                      alt="poster video"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className={css.externalVideo}>
                      External video (click to open)
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScrollWrapper>
      )}
    </>
  );
}
