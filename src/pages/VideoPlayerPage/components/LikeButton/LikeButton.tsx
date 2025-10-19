import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchLikesCount, toggleLikeVideo } from "redux/videos/operations";
import { selectVideoById } from "redux/videos/selectors";
import { useEffect, useState } from "react";
import Heart from "icons/Heart";
import styles from "./LikeButton.module.css";

type LikeButtonProps = {
  videoId?: number;
};

export default function LikeButton({ videoId }: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const video = useAppSelector((state) =>
    videoId ? selectVideoById(videoId)(state) : undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const [pop, setPop] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchLikesCount({ videoId }));
    }
  }, [videoId, dispatch]);

  if (!video || !videoId) return null;

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(toggleLikeVideo({ videoId })).unwrap();

      setPop(true);
      setTimeout(() => setPop(false), 300);

      if ((video.likes ?? 0) > 0) {
        setBounce(true);
        setTimeout(() => setBounce(false), 300);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`${styles.btn} ${video.liked ? styles.liked : ""}`}
    >
      {(video.likes ?? 0) > 0 && (
        <span className={`${styles.count} ${bounce ? styles.countBounce : ""}`}>
          {video.likes}
        </span>
      )}
      <span className={styles.iconWrapper}>
        <Heart className={`${styles.icon} ${pop ? styles.pop : ""}`} />
      </span>
    </button>
  );
}
