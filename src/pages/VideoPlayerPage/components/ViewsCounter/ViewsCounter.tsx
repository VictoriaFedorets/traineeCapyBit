import css from "./ViewsCounter.module.css";
import EyeViewIcon from "icons/EyeView";

interface ViewsCounterProps {
  views: number;
}

export default function ViewsCounter({ views }: ViewsCounterProps) {
  return (
    <div className={css.viewsContainer}>
      <span className={css.count}>{views}</span>{" "}
      <EyeViewIcon size={20} className={css.icon} />
    </div>
  );
}
