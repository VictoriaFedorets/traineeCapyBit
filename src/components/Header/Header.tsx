import css from "./Header.module.css";
import { useState } from "react";
import LogoImg from "../../images/logo.png";
import { Link } from "react-router-dom";
import BurgerMenu from "@components/BurgerMenu/BurgerMenu";
import MenuIcon from "icons/Menu";
import { selectIsLoggedIn } from "../../redux/user/selectors";
import LogOutBtn from "@components/LogOutBtn/LogOutBtn";
import { useAppSelector } from "redux/hooks";
import ChatIcon from "icons/Chat";
import WeatherWidget from "@components/WeatherWidget/WeatherWidget";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const openModal = () => setIsModalOpen(true);
  const toggleBurger = () => setIsBurgerOpen(!isBurgerOpen);
  const closeBurger = () => setIsBurgerOpen(false);

  return (
    <div className={css.conteinerHeader}>
      <div className={css.conteinerLogo}>
        <Link to="/">
          <img className={css.logo} src={LogoImg} alt="Logo" />
        </Link>

        <WeatherWidget />
      </div>

      <div className={css.btnBlock}>
        {isLoggedIn ? (
          <>
            <Link to="/chats">
              <ChatIcon className={css.iconChat} />
            </Link>
            <LogOutBtn className={css.btnRegister} />
          </>
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
