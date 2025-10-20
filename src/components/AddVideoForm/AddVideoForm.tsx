import { useEffect, useState } from "react";
import BaseModal from "@components/BaseModal/BaseModal";
import css from "./AddVideoForm.module.css";
import { useAppSelector } from "redux/hooks";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { selectStatus } from "redux/videos/selectors";
import { getYouTubeVideoId, getYouTubeThumbnail } from "utils/youtube";

interface VideoFormProps {
  onClose: () => void;
  onSubmit: (data: VideoFormInputs) => void;
  initialValues?: VideoFormInputs;
  title?: string;
  submitText?: string;
}

interface VideoFormInputs {
  name: string;
  url: string;
  poster?: string;
}

export default function AddVideoForm({
  onClose,
  onSubmit,
  title = "Add new video",
  submitText = "Save",
  initialValues,
}: VideoFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const status = useAppSelector(selectStatus);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VideoFormInputs>({
    defaultValues: initialValues || { name: "", url: "", poster: "" },
  });

  const videoURL = watch("url");
  const posterInput = watch("poster");

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const getYouTubeVideoId = (url: string) => {
    try {
      return (
        new URL(url).searchParams.get("v") ||
        url.split("/").pop()?.split("?")[0] ||
        ""
      );
    } catch {
      return "";
    }
  };

  // Автоматическая подстановка постера для YouTube
  useEffect(() => {
    if (videoURL) {
      const isYouTube =
        videoURL.includes("youtube.com") || videoURL.includes("youtu.be");
      if (isYouTube) {
        setValue("poster", getYouTubeThumbnail(videoURL));
      }
    }
  }, [videoURL, setValue]);

  const handleFormSubmit: SubmitHandler<VideoFormInputs> = async (data) => {
    let poster = data.poster;

    if (
      !poster &&
      (data.url.includes("youtube.com") || data.url.includes("youtu.be"))
    ) {
      poster = getYouTubeThumbnail(data.url);
    }

    if (!poster) {
      poster = `${window.location.origin}/placeholder.png`;
    }

    try {
      await onSubmit({
        name: data.name.trim(),
        url: data.url.trim(),
        poster: poster.trim(),
      });
      setIsModalOpen(false);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add video");
    }
  };

  const posterForPreview = posterInput || "/placeholder.png";

  return (
    <>
      {isModalOpen && (
        <BaseModal onClose={onClose}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className={css.form}>
            <h2>{title}</h2>

            <label className={css.label}>
              <p>Name:</p>
              <input
                type="text"
                className={css.input}
                placeholder="Video name"
                {...register("name", {
                  required: "Please enter a video name.",
                })}
              />
              {errors.name && (
                <div className={css.errorWrapper}>
                  <p className={css.error}>{errors.name.message}</p>
                </div>
              )}
            </label>

            <label className={css.label}>
              <p>Video URL:</p>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                className={css.input}
                {...register("url", {
                  required: "Please enter a video URL.",
                  pattern: {
                    value: /^(https?:\/\/|data:video\/)/i,
                    message: "Please enter a valid video URL.",
                  },
                })}
              />
              {errors.url && (
                <div className={css.errorWrapper}>
                  <p className={css.error}>{errors.url.message}</p>
                </div>
              )}
            </label>

            <label className={css.label}>
              <p>Poster URL:</p>
              <input
                type="url"
                className={css.input}
                placeholder="Video poster URL"
                {...register("poster", {
                  validate: (value) =>
                    !value ||
                    /^https?:\/\/.+$/i.test(value) ||
                    "Enter a valid image URL",
                })}
              />
              {errors.poster && (
                <div className={css.errorWrapper}>
                  <p className={css.error}>{errors.poster.message}</p>
                </div>
              )}
            </label>

            {videoURL && (
              <div className={css.videoPreview}>
                {videoURL.includes("youtube.com") ||
                videoURL.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      videoURL
                    )}`}
                    title="YouTube video preview"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoURL} poster={posterForPreview} controls>
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            <button
              type="submit"
              className={css.btn}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Saving..." : submitText}
            </button>
          </form>
        </BaseModal>
      )}
    </>
  );
}
