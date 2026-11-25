import LoadingState from "@/components/layout/LoadingState";
import { useGetLoginMethods } from "@/features/auth";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import AuthTemplate from "@/templates/auth";
import { Button } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

interface PasswordRecoveryGuardProps {
  readonly children: ReactNode;
}

const PasswordRecoveryGuard: FC<PasswordRecoveryGuardProps> = ({
  children,
}) => {
  const { isSelfHosted, envLoading } = useEnv();
  const queryClient = useQueryClient();
  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods({ enabled: isSelfHosted });

  if (envLoading || (isSelfHosted && loginMethodsLoading)) {
    return <LoadingState />;
  }

  if (isSelfHosted && isLoginMethodsError) {
    return (
      <AuthTemplate title="Password recovery unavailable">
        <p role="alert">
          Unable to check password recovery availability. Please try again.
        </p>
        <Button
          onClick={() => {
            void queryClient.resetQueries({ queryKey: ["loginMethods"] });
          }}
        >
          Try again
        </Button>
        <p>
          <Link to={ROUTES.auth.login()}>Back to Login</Link>
        </p>
      </AuthTemplate>
    );
  }

  if (
    !isSelfHosted ||
    !loginMethods?.password.available ||
    !loginMethods.password.enabled
  ) {
    return (
      <AuthTemplate title="Password recovery unavailable">
        <p>
          Local password recovery is not available. Use your identity provider
          or contact your administrator.
        </p>
        <Link to={ROUTES.auth.login()}>Back to Login</Link>
      </AuthTemplate>
    );
  }

  return children;
};

export default PasswordRecoveryGuard;
