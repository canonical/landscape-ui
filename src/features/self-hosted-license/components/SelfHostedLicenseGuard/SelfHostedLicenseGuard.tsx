import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import useDebug from "@/hooks/useDebug";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { useEffect, useEffectEvent, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useGetSelfHostedEnabled } from "../../api/useGetSelfHostedEnabled";

interface Props {
  readonly children: ReactNode;
}

const SelfHostedLicenseGuard: FC<Props> = ({ children }) => {
  const { isSaas, envLoading } = useEnv();
  const selfHostedEnabledQuery = !envLoading && isSaas;
  const {
    isGettingSelfHostedEnabled,
    isSelfHostedEnabled,
    selfHostedEnabledError,
  } = useGetSelfHostedEnabled(selfHostedEnabledQuery);
  const debug = useDebug();
  const navigate = useNavigate();
  const shouldRender = isSaas && isSelfHostedEnabled;

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
    return <Redirecting />;
  }

  return shouldRender ? <>{children}</> : <Redirecting />;
};

export default SelfHostedLicenseGuard;
