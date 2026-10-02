import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import EnvError from "@/pages/EnvError";

interface Props {
  readonly children: ReactNode;
}

export const SelfHostedGuard: FC<Props> = ({ children }) => {
  const { isSelfHosted, envLoading, envError } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (envError || isSelfHosted || envLoading) return;
    navigate(ROUTES.errors.envError(), { replace: true });
  }, [isSelfHosted, envLoading, envError, navigate]);

  if (envError) return <EnvError />;
  if (envLoading) return <LoadingState />;

  return isSelfHosted ? <>{children}</> : <Redirecting />;
};
