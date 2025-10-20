import { useEffect, useRef, useState } from "react";
import Controls from "@pages/VideoPlayerPage/components/Controls/Controls";
import css from "./VideoPlayer.module.css";
import DeleteVideoBtn from "@pages/HomePage/components/VideoList/DeleteVideoBtn/DeleteVideoBtn";
import EditVideoBtn from "@pages/HomePage/components/EditVideoBtn/EditVideoBtn";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectVideos } from "redux/videos/selectors";
import { addVideoView } from "redux/videos/operations";

interface VideoPlayerProps {
  id: number;
  name: string;
  src: string;
  poster?: string;
}

export default function VideoPlayer({
  id,
  name,
  src,
  poster,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [views, setViews] = useState(0);
  const [hasViewed, setHasViewed] = useState(false);
  const [watchTimer, setWatchTimer] = useState<number>(0); // сколько секунд реально просмотрено

  const videos = useAppSelector(selectVideos);
  const updatedVideo = videos.find((v) => v.id === id);

  const finalName = updatedVideo?.name || name;
  const finalSrc = updatedVideo?.url || src;
  const finalPoster = updatedVideo?.poster || poster;
  const initialViews = updatedVideo?.viewsCount || 0;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setViews(initialViews);
  }, [initialViews]);

  // 🔹 Отслеживаем просмотр каждые 1 сек.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (videoRef.current && !hasViewed) {
      const video = videoRef.current;

      const updateWatchTime = () => {
        if (!video.paused && !video.ended) {
          setWatchTimer((prev) => prev + 1);
        }
      };

      interval = setInterval(updateWatchTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasViewed]);

  // 🔹 Если просмотрено ≥ 10 секунд — засчитываем просмотр
  useEffect(() => {
    if (watchTimer >= 10 && !hasViewed) {
      setHasViewed(true);
      dispatch(addVideoView({ videoId: id })).then((action) => {
        const newViews =
          (action.payload as { views: number })?.views || views + 1;
        setViews(newViews);
      });
    }
  }, [watchTimer, hasViewed, dispatch, id, views]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Закрытие дропдаунов при клике вне контролов
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(e.target as Node)
      ) {
        document.dispatchEvent(new Event("closeDropdowns"));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={css.videoConteiner}>
      <div className={css.titleContainer}>
        <h2>{finalName}</h2>
        <div className={css.titleBtnContainer}>
          <EditVideoBtn
            id={id}
            name={finalName}
            url={finalSrc}
            poster={finalPoster}
          />
          <DeleteVideoBtn id={id} />
        </div>
      </div>

      <video
        className={css.video}
        ref={videoRef}
        src={finalSrc}
        poster={finalPoster || undefined}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div ref={controlsRef}>
        <Controls
          videoRef={videoRef}
          currentTime={currentTime}
          duration={duration}
          setCurrentTime={setCurrentTime}
          videoId={updatedVideo?.id}
          views={views}
        />
      </div>
    </div>
  );
}
