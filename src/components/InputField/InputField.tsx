import { FC } from "react";
import css from "./InputField.module.css";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}

const InputField: FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  error,
  autoComplete,
}) => {
  const { register } = useFormContext();

  return (
    <label className={css.label}>
      <p className={css.text}>{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={error ? `${css.input} ${css.inputError}` : css.input}
        {...register(name)}
      />
      {error && <p className={css.error}>{error}</p>}
    </label>
  );
};

export default InputField;
