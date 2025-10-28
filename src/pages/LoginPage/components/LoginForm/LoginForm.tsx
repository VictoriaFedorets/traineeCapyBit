import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { login } from "@redux/user/operations";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormWrapper from "@components/FormWrapper/FormWrapper";
import InputField from "@components/InputField/InputField";
import PasswordInput from "@components/PasswordInput/PasswordInput";
import { selectAuthLoading } from "@redux/user/selectors";

interface UserFormInputs {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email required"),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters long")
    .max(64, "The password must be no longer than 64 characters")
    .required("Password required"),
});

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);

  const methods = useForm<UserFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

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
    <FormProvider {...methods}>
      <FormWrapper
        title="Login"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        submitText="Login"
        linkText="Registration"
        linkTo="/register"
      >
        <InputField
          label="Enter your email"
          name="email"
          type="email"
          placeholder="E-mail"
          error={errors.email?.message}
        />
        <PasswordInput
          label="Enter your password"
          name="password"
          placeholder="Password"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </FormWrapper>
    </FormProvider>
  );
}
