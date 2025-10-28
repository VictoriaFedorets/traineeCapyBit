import { useState } from "react";
import { useAppDispatch } from "redux/hooks";
import { logout } from "../../redux/user/operations";
import AreYouSureModal from "@components/AreYouSureModal/AreYouSureModal";
import { useNavigate } from "react-router-dom";

interface LogOutBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function LogOutBtn({ className }: LogOutBtnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmLogout = async () => {
    await dispatch(logout());
    handleCloseModal();
    navigate("/");
  };

  return (
    <>
      <button onClick={handleOpenModal} className={className}>
        Log out
      </button>

      {isModalOpen && (
        <AreYouSureModal
          onConfirm={handleConfirmLogout}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
