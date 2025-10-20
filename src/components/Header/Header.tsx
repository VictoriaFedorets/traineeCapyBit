import css from "./Header.module.css";
import { useState } from "react";
import LogoImg from "../../images/logo.png";
import { Link } from "react-router-dom";
import BurgerMenu from "@components/BurgerMenu/BurgerMenu";
import MenuIcon from "icons/Menu";
import { selectIsLoggedIn } from "../../redux/user/userSelectors";
import LogOutBtn from "@components/LogOutBtn/LogOutBtn";
import { useAppSelector } from "redux/hooks";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const openModal = () => setIsModalOpen(true);
  const toggleBurger = () => setIsBurgerOpen(!isBurgerOpen);
  const closeBurger = () => setIsBurgerOpen(false);

  return (
    <div className={css.conteinerHeader}>
      <Link to="/">
        <img className={css.logo} src={LogoImg} alt="Logo" />
      </Link>

      <div className={css.btnBlock}>
        {isLoggedIn ? (
          <LogOutBtn className={css.btnRegister} />
        ) : (
          <>
            <Link to="/login" className={css.btnLogin}>
              Login
            </Link>
            <Link to="/register" className={css.btnRegister}>
              Registration
            </Link>
          </>
        )}
      </div>

      <MenuIcon className={css.burgerBtn} onClick={toggleBurger} />
      {isBurgerOpen && (
        <BurgerMenu
          openModal={openModal}
          closeBurger={closeBurger}
          isOpen={isBurgerOpen}
        />
      )}
    </div>
  );
}
