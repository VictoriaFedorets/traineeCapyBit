import { useEffect, useRef, useState } from "react";
import Controls from "@pages/VideoPlayerPage/components/Controls/Controls";
import css from "./VideoPlayer.module.css";
import DeleteVideoBtn from "@pages/HomePage/components/VideoList/DeleteVideoBtn/DeleteVideoBtn";
import EditVideoBtn from "@pages/HomePage/components/EditVideoBtn/EditVideoBtn";
import { useAppSelector } from "redux/hooks";
import { selectVideos } from "redux/videos/selectors";

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

  const videos = useAppSelector(selectVideos);
  const updatedVideo = videos.find((v) => v.id === id);

  const finalName = updatedVideo?.name || name;
  const finalSrc = updatedVideo?.url || src;
  const finalPoster = updatedVideo?.poster || poster;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // тривалість записуємо в стейт
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

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
        // autoPlay
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
        />
      </div>
    </div>
  );
}
