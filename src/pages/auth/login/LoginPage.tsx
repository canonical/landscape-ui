import { FC } from "react";
import AuthTemplate from "../../../templates/auth";
import LoginForm from "./LoginForm/LoginForm";
import { AvailableProviderList } from "@/features/identity-providers";

const LoginPage: FC = () => {
  return (
    <AuthTemplate title="Login">
      <LoginForm />
      <AvailableProviderList />
    </AuthTemplate>
  );
};

export default LoginPage;
