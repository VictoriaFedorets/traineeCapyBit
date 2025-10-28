import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { register as registerUser } from "@redux/user/operations";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormWrapper from "@components/FormWrapper/FormWrapper";
import InputField from "@components/InputField/InputField";
import PasswordInput from "@components/PasswordInput/PasswordInput";
import { selectAuthLoading } from "@redux/user/selectors";

const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface UserFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email")
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

export default function RegistrationForm() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const methods = useForm<UserFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<UserFormInputs> = ({
    name,
    email,
    password,
  }) => {
    dispatch(registerUser({ name, email, password }));
    reset();
  };

  return (
    <FormProvider {...methods}>
      <FormWrapper
        title="Registration"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        submitText="Registration"
        linkText="Login"
        linkTo="/login"
      >
        <InputField
          label="Enter your name"
          name="name"
          placeholder="Name"
          error={errors.name?.message}
        />
        <InputField
          label="Enter your email"
          name="email"
          placeholder="E-mail"
          type="email"
          error={errors.email?.message}
        />
        <PasswordInput
          label="Enter your password"
          name="password"
          placeholder="Password"
          error={errors.password?.message}
        />
        <PasswordInput
          label="Repeat your password"
          name="confirmPassword"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
        />
      </FormWrapper>
    </FormProvider>
  );
}
