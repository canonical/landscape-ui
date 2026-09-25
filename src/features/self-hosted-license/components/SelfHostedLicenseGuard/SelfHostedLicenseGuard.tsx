import LoadingState from "@/components/layout/LoadingState";
import { useSelfHostedLicense } from "@/context/selfHostedLicense";
import Redirecting from "@/components/layout/Redirecting";
import useDebug from "@/hooks/useDebug";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { useEffect, useEffectEvent, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface Props {
  readonly children: ReactNode;
}

const SelfHostedLicenseGuard: FC<Props> = ({ children }) => {
  const { isSaas, envLoading } = useEnv();
  const {
    isGettingSelfHostedEnabled,
    isSelfHostedEnabled,
    selfHostedEnabledError,
    isEntitlementQueryEnabled: selfHostedEnabledQuery,
  } = useSelfHostedLicense();
  const debug = useDebug();
  const navigate = useNavigate();
  const shouldRender = isSaas && isSelfHostedEnabled && !selfHostedEnabledError;

  const showEntitlementError = useEffectEvent((error: unknown) => {
    debug(error);
  });

  useEffect(() => {
    if (selfHostedEnabledError) {
      showEntitlementError(selfHostedEnabledError);
    }
  }, [selfHostedEnabledError]);

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

    if (selfHostedEnabledError) {
      return;
    }

    navigate(ROUTES.account.general(), { replace: true });
  }, [
    envLoading,
    isGettingSelfHostedEnabled,
    navigate,
    selfHostedEnabledError,
    selfHostedEnabledQuery,
    shouldRender,
    isSaas,
  ]);

  if (envLoading || (selfHostedEnabledQuery && isGettingSelfHostedEnabled)) {
    return <LoadingState />;
  }

  if (selfHostedEnabledError) {
    return null;
  }

  return shouldRender ? <>{children}</> : <Redirecting />;
};

export default SelfHostedLicenseGuard;
