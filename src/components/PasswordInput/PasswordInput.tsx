import { FC, useState } from "react";
import css from "./PasswordInput.module.css";
import Eye from "icons/Eye";
import EyeHiddenIcon from "icons/EyeHidden";
import { useFormContext } from "react-hook-form";

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}

const PasswordInput: FC<PasswordInputProps> = ({
  label,
  name,
  placeholder,
  error,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const { register } = useFormContext();

  return (
    <label className={css.label}>
      <p className={css.text}>{label}</p>
      <div className={css.inputContainer}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={error ? `${css.input} ${css.inputError}` : css.input}
          {...register(name)}
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
      {error && <p className={css.error}>{error}</p>}
    </label>
  );
};

export default PasswordInput;
