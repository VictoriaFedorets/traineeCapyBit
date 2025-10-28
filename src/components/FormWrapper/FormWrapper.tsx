import { FC, ReactNode } from "react";
import css from "./FormWrapper.module.css";
import Loader from "@components/Loader/Loader";
import { Link } from "react-router-dom";

interface FormWrapperProps {
  title: string;
  onSubmit: any;
  isLoading: boolean;
  submitText: string;
  linkText: string;
  linkTo: string;
  children: ReactNode;
}

const FormWrapper: FC<FormWrapperProps> = ({
  title,
  onSubmit,
  isLoading,
  submitText,
  linkText,
  linkTo,
  children,
}) => {
  return (
    <div className={css.containerForm}>
      <form className={css.form} onSubmit={onSubmit}>
        <h2 className={css.title}>{title}</h2>
        {children}
        <button type="submit" className={css.button}>
          {isLoading ? <Loader /> : submitText}
        </button>
      </form>
      <p>
        {title === "Login"
          ? "Don’t have an account? "
          : "Already have an account? "}
        <Link className={css.link} to={linkTo}>
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default FormWrapper;
