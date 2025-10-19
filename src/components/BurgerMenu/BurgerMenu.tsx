import css from "./BurgerMenu.module.css";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectUser } from "../../redux/user/userSelectors";
import { Link } from "react-router-dom";
import CloseIcon from "icons/Close";
import LogOutBtn from "@components/LogOutBtn/LogOutBtn";

interface BurgerMenuProps {
  openModal: () => void;
  closeBurger: () => void;
  isOpen: boolean;
}

export default function BurgerMenu({ closeBurger, isOpen }: BurgerMenuProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const mounted = useRef(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      closeBurger();
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["a", "svg", "use"].includes(tag)) {
      closeBurger();
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!isLoggedIn && isOpen) {
      closeBurger();
    }
  }, [isLoggedIn, isOpen, closeBurger]);

  return (
    <div
      className={`${css.burgerWrapper} ${isOpen ? css.open : ""}`}
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <div onClick={handleMenuClick}>
        <CloseIcon className={css.closeBtn} onClick={closeBurger} />

        <div className={css.menuContent}>
          {isLoggedIn ? (
            <div>
              <p className={css.text}>
                Hello, {user?.name}! You can add a video to your video player.
              </p>
            </div>
          ) : (
            <p className={css.text}>
              Please log in or register to add a video to the video player.
            </p>
          )}

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
        </div>
      </div>
    </div>
  );
}
