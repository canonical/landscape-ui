import { FC } from "react";
import AuthTemplate from "../../../templates/auth";
import LoginForm from "./LoginForm";

const LoginPage: FC = () => {
  return (
    <AuthTemplate title="Login">
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;
