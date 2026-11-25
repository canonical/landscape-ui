import LoadingState from "@/components/layout/LoadingState";
import { useSelfHostedLicense } from "@/context/selfHostedLicense";
import Redirecting from "@/components/layout/Redirecting";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { useEffect, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface Props {
  readonly children: ReactNode;
}

const SelfHostedLicenseGuard: FC<Props> = ({ children }) => {
  const { isSaas, envLoading } = useEnv();
  const {
    isGettingSelfHostedEnabled,
    isSelfHostedEnabled,
    isEntitlementQueryEnabled: selfHostedEnabledQuery,
  } = useSelfHostedLicense();
  const navigate = useNavigate();
  const shouldRender = isSaas && isSelfHostedEnabled;

  useEffect(() => {
    if (
      envLoading ||
      (selfHostedEnabledQuery && isGettingSelfHostedEnabled) ||
      shouldRender
    ) {
      return;
    }

    if (!isSaas) {
      navigate(ROUTES.errors.envError(), { replace: true });
      return;
    }

    navigate(ROUTES.account.general(), { replace: true });
  }, [
    envLoading,
    isGettingSelfHostedEnabled,
    navigate,
    selfHostedEnabledQuery,
    shouldRender,
    isSaas,
  ]);

  if (envLoading || (selfHostedEnabledQuery && isGettingSelfHostedEnabled)) {
    return <LoadingState />;
  }

  return shouldRender ? <>{children}</> : <Redirecting />;
};

export default SelfHostedLicenseGuard;
