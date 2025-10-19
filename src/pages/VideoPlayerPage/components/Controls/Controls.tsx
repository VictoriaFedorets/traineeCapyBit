import FullScreenBtn from "@pages/VideoPlayerPage/components/Buttons/FullScreenBtn";
import PlayPauseBtn from "@pages/VideoPlayerPage/components/Buttons/PlayPauseBtn";
import VolumeControlBtn from "@pages/VideoPlayerPage/components/Buttons/VolumeControlBtn";
import Timeline from "@pages/VideoPlayerPage/components/Timeline/Timeline";
import SpeedBtn from "@pages/VideoPlayerPage/components/Buttons/SpeedBtn";
import { RefObject } from "react";
import css from "./Controls.module.css";
import LikeButton from "../LikeButton/LikeButton";

interface ControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  currentTime: number;
  duration: number;
  videoId?: number;
  setCurrentTime: (time: number) => void;
}

export default function Controls({
  videoRef,
  currentTime,
  duration,
  videoId,
  setCurrentTime,
}: ControlsProps) {
  return (
    <>
      <Timeline
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
        setCurrentTime={setCurrentTime}
      />
      <div className={css.btnWrapper}>
        <div className={css.btnFirstBlock}>
          <PlayPauseBtn videoRef={videoRef} />
          <VolumeControlBtn videoRef={videoRef} />
        </div>
        <div className={css.btnFirstBlock}>
          <LikeButton videoId={videoId} />
          <SpeedBtn videoRef={videoRef} />
          <FullScreenBtn videoRef={videoRef} />
        </div>
      </div>
    </>
  );
}
