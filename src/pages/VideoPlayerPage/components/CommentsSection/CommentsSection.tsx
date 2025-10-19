import { useSelector } from "react-redux";
import { useAppDispatch } from "redux/hooks";
import { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePaginatedList } from "hooks/usePaginatedList";
import css from "./CommentsSection.module.css";
import { selectCommentsByVideoId } from "redux/videos/selectors";
import { selectUser } from "redux/user/userSelectors";
import {
  addCommentToVideo,
  fetchCommentsByVideo,
} from "redux/videos/operations";
import { VideoComment } from "redux/videos/types";
import InfiniteScrollWrapper from "components/InfiniteScrollWrapper/InfiniteScrollWrapper";

interface CommentFormInputs {
  text: string;
}

interface CommentsSectionProps {
  videoId: number;
}

export default function CommentsSection({ videoId }: CommentsSectionProps) {
  const dispatch = useAppDispatch();
  const comments = useSelector(selectCommentsByVideoId(videoId));
  const user = useSelector(selectUser);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormInputs>({
    defaultValues: { text: "" },
  });

  const commentText = watch("text");

  const { visibleItems, showMore, fetchMoreItems, loading, dataLength } =
    usePaginatedList({ items: comments, perPage: 3, delay: 1000 });

  useEffect(() => {
    dispatch(fetchCommentsByVideo({ videoId }));
  }, [dispatch, videoId]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [commentText]);

  const onSubmit: SubmitHandler<CommentFormInputs> = async (data) => {
    if (!data.text.trim()) return;
    try {
      const result = await dispatch(
        addCommentToVideo({ videoId, text: data.text })
      ).unwrap();

      if (result) {
        reset();
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className={css.commentsSection}>
      <h4 className={css.title}>Comments</h4>

      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <textarea
          {...register("text", { required: "Comment cannot be empty" })}
          ref={(e) => {
            register("text").ref(e);
            textareaRef.current = e;
          }}
          placeholder="Write a comment..."
          className={css.textarea}
          disabled={isSubmitting}
          rows={1}
        />
        {errors.text && (
          <span className={css.error}>{errors.text.message}</span>
        )}
        <button type="submit" className={css.submitBtn} disabled={isSubmitting}>
          Send
        </button>
      </form>

      {visibleItems.length === 0 ? (
        <p className={css.showMoreMessage}>No comments yet.</p>
      ) : (
        <InfiniteScrollWrapper
          dataLength={dataLength}
          hasMore={showMore}
          next={fetchMoreItems}
          loading={loading}
          endMessage={
            comments.length > 3 && (
              <p className={css.showMoreMessage}>No more comments</p>
            )
          }
        >
          <ul className={css.list}>
            {visibleItems.map((comment: VideoComment) => (
              <li key={comment.id} className={css.commentItem}>
                <div className={css.commentHeader}>
                  <span className={css.author}>
                    {comment.user?.name || user?.name || "Unknown"}
                  </span>
                  {Number(user?.id) === comment.user?.id && (
                    <span className={css.youTag}>(you)</span>
                  )}
                </div>

                <p className={css.text}>{comment.text}</p>
                <span className={css.date}>
                  {new Date(comment.createdAt).toDateString()}
                </span>
              </li>
            ))}
          </ul>
        </InfiniteScrollWrapper>
      )}
    </div>
  );
}
