import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";

interface Props {
  readonly children: ReactNode;
}

export const SelfHostedGuard: FC<Props> = ({ children }) => {
  const { isSelfHosted, envLoading } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSelfHosted || envLoading) return;
    navigate(ROUTES.errors.envError(), { replace: true });
  }, [isSelfHosted, envLoading, navigate]);

  if (envLoading) return <LoadingState />;

  return isSelfHosted ? <>{children}</> : <Redirecting />;
};
