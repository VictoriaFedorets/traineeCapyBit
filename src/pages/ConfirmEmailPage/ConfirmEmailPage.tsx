import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { confirmEmail } from "redux/user/operations";
import { useAppDispatch } from "redux/hooks";

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();

  const handleEmailConfirmation = async () => {
    if (!token) {
      console.error("Token is missing");
      setTimeout(() => {
        navigate("/");
      }, 3000);
      return;
    }

    try {
      await dispatch(confirmEmail({ token })).unwrap();
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  useEffect(() => {
    handleEmailConfirmation();
  }, [token]);

  return (
    <>
      <h1>Confirming Email...</h1>
      <p>Please wait while we confirm your email.</p>
    </>
  );
};

export default ConfirmEmailPage;
