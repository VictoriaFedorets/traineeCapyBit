import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { register } from "redux/user/userOperations";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import css from "./RegistrarionForm.module.css";
import { selectAuthLoading } from "redux/user/userSelectors";
import Loader from "@components/Loader/Loader";
import Eye from "icons/Eye";
import EyeHiddenIcon from "icons/EyeHidden";
import { useAppDispatch, useAppSelector } from "redux/hooks";

const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email, please write a valid email")
    .matches(emailRegEx, "Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^[^\s]*$/, "Password should not contain spaces")
    .max(64, "The password must be no longer than 64 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface UserFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegistrationForm() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLoading = useAppSelector(selectAuthLoading);

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit: SubmitHandler<UserFormInputs> = ({
    name,
    email,
    password,
  }) => {
    dispatch(register({ name, email, password }));
    reset();
  };

  return (
    <div className={css.containerForm}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={css.title}>Registration</h2>

        {/* Name */}
        <label className={css.label}>
          <p className={css.text}>Enter your name</p>
          <input
            type="text"
            placeholder="Name"
            className={
              errors.name ? `${css.input} ${css.inputError}` : css.input
            }
            {...formRegister("name")}
          />
          {errors.name && (
            <div className={css.errorWrapper}>
              <p className={css.error}>{errors.name.message}</p>
            </div>
          )}
        </label>

        {/* Email */}
        <label className={css.label}>
          <p className={css.text}>Enter your email</p>
          <input
            type="email"
            placeholder="E-mail"
            className={
              errors.email ? `${css.input} ${css.inputError}` : css.input
            }
            {...formRegister("email")}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </label>

        {/* Password */}
        <label className={css.label}>
          <p className={css.text}>Enter your password</p>
          <div className={css.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              className={
                errors.password ? `${css.input} ${css.inputError}` : css.input
              }
              {...formRegister("password")}
            />
            <button
              type="button"
              className={css.btnIcon}
              onClick={(e) => {
                e.preventDefault();
                toggleShowPassword();
              }}
            >
              {showPassword ? (
                <Eye className={css.icon} />
              ) : (
                <EyeHiddenIcon className={css.icon} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className={css.error}>{errors.password.message}</p>
          )}
        </label>

        {/* Confirm Password */}
        <label className={css.label}>
          <p className={css.text}>Repeat your password</p>
          <div className={css.inputContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              autoComplete="new-password"
              className={
                errors.confirmPassword
                  ? `${css.input} ${css.inputError}`
                  : css.input
              }
              {...formRegister("confirmPassword")}
            />
            <button
              type="button"
              className={css.btnIcon}
              onClick={(e) => {
                e.preventDefault();
                toggleShowConfirmPassword();
              }}
            >
              {showConfirmPassword ? (
                <Eye className={css.icon} />
              ) : (
                <EyeHiddenIcon className={css.icon} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className={css.error}>{errors.confirmPassword.message}</p>
          )}
        </label>

        <button type="submit" className={css.button}>
          {isLoading ? <Loader /> : "Registration"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link className={css.link} to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
