import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { useEffect, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useGetSelfHostedEnabled } from "../../api/useGetSelfHostedEnabled";

interface Props {
  readonly children: ReactNode;
}

const SelfHostedLicenseGuard: FC<Props> = ({ children }) => {
  const { isSaas, envLoading } = useEnv();
  const { isGettingSelfHostedEnabled, isSelfHostedEnabled, isSelfHostedEnabledError } =
    useGetSelfHostedEnabled(!envLoading && isSaas);
  const navigate = useNavigate();
  const shouldRender =
    isSaas && isSelfHostedEnabled && !isSelfHostedEnabledError;

  useEffect(() => {
    if (envLoading || isGettingSelfHostedEnabled || shouldRender) return;
    navigate(ROUTES.errors.envError(), { replace: true });
  }, [envLoading, isGettingSelfHostedEnabled, navigate, shouldRender]);

  if (envLoading || (isSaas && isGettingSelfHostedEnabled)) {
    return <LoadingState />;
  }

  return shouldRender ? <>{children}</> : <Redirecting />;
};

export default SelfHostedLicenseGuard;
