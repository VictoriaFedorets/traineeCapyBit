import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SharedLayout from "layouts/SharedLayout/SharedLayout";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import Loader from "@components/Loader/Loader";

const HomePage = lazy(() => import("@pages/HomePage/HomePage"));
const VideoPlayerPage = lazy(
  () => import("@pages/VideoPlayerPage/VideoPlayerPage")
);
const RegistrarionPage = lazy(
  () => import("@pages/RegistrarionPage/RegistrarionPage")
);
const ConfirmEmailPage = lazy(
  () => import("@pages/ConfirmEmailPage/ConfirmEmailPage")
);
const LoginPage = lazy(() => import("@pages/LoginPage/LoginPage"));
const ChatsPage = lazy(() => import("@pages/ChatsPage/ChatsPage"));
const WeatherPage = lazy(() => import("@pages/WeatherPage/WeatherPage"));

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<HomePage />} />
            <Route path="videoPlayer" element={<VideoPlayerPage />} />
            <Route path="register" element={<RegistrarionPage />} />
            <Route path="confirm-email" element={<ConfirmEmailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="weather" element={<WeatherPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
