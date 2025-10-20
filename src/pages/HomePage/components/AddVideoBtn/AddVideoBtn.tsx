import css from "./AddVideoBtn.module.css";
import { selectIsLoggedIn } from "redux/user/userSelectors";
import Plus from "icons/Plus";
import { useState } from "react";
import AddVideoForm from "@components/AddVideoForm/AddVideoForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { addVideo } from "redux/videos/operations";
import Cat from "/favicon.png";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface AddVideoBtnProps {
  className?: string;
}

export default function AddVideoBtn({ className }: AddVideoBtnProps) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAddVideo = (data: {
    name: string;
    url: string;
    poster?: string;
  }) => {
    dispatch(
      addVideo({
        name: data.name.trim(),
        url: data.url.trim(),
        poster: data.poster?.trim(),
      })
    );
  };

  return (
    <>
      <button onClick={openModal} className={clsx(css.btnPlus, className)}>
        <Plus className={css.iconPlus} />
        {""}add video
        <img className={css.logoCat} src={Cat} alt="cat with camera" />
      </button>

      {isModalOpen && (
        <AddVideoForm
          title="Add video"
          submitText="Save"
          onClose={closeModal}
          onSubmit={handleAddVideo}
        />
      )}
    </>
  );
}
