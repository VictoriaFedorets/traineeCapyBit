import css from "./HomePage.module.css";
import VideoList from "@pages/HomePage/components/VideoList/VideoList";
import AddVideoBtn from "./components/AddVideoBtn/AddVideoBtn";
import { useAppSelector } from "redux/hooks";
import { selectVideos } from "redux/videos/selectors";

export default function HomePage() {
  const videos = useAppSelector(selectVideos);

  return (
    <section className={css.containerHome}>
      {videos.length > 0 && <AddVideoBtn className={css.btnAdd} />}
      <VideoList />
    </section>
  );
}
