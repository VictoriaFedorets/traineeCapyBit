import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { login } from "redux/user/userOperations";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import css from "./LoginForm.module.css";
import { selectAuthLoading } from "redux/user/userSelectors";
import Loader from "@components/Loader/Loader";
import Eye from "icons/Eye";
import EyeHiddenIcon from "icons/EyeHidden";
import { useAppDispatch, useAppSelector } from "redux/hooks";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email required"),

  password: Yup.string()
    .min(8, "The password must be at least 8 characters long")
    .max(64, "The password must be no longer than 64 characters")
    .required("Password required"),
});

interface UserFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAppSelector(selectAuthLoading);
  const navigate = useNavigate();

  const {
    register: formLogin,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit: SubmitHandler<UserFormInputs> = async ({
    email,
    password,
  }) => {
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      reset();
      navigate("/", { replace: true });
    }
  };

  return (
    <div className={css.containerForm}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={css.title}>Login</h2>

        {/* Email */}
        <label className={css.label}>
          <p className={css.text}>Enter your email</p>
          <input
            type="email"
            placeholder="E-mail"
            className={
              errors.email ? `${css.input} ${css.inputError}` : css.input
            }
            {...formLogin("email")}
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
              autoComplete="current-password"
              className={
                errors.password ? `${css.input} ${css.inputError}` : css.input
              }
              {...formLogin("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        <button type="submit" className={css.button}>
          {isLoading ? <Loader /> : "Login"}
        </button>
      </form>
      <p>
        Don’t have an account?{" "}
        <Link className={css.link} to="/register">
          Registration
        </Link>
      </p>
    </div>
  );
}
