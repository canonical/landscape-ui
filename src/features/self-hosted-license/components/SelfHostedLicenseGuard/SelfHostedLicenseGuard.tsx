import LoadingState from "@/components/layout/LoadingState";
import Redirecting from "@/components/layout/Redirecting";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
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
  const { notify } = useNotify();
  const navigate = useNavigate();
  const shouldRender = isSaas && isSelfHostedEnabled;
  const showEntitlementError = useEffectEvent((error: unknown) => {
    notify.error({
      title: "Unable to check legacy license entitlement",
      message: "The account's legacy license entitlement could not be checked.",
      error,
    });
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
      selfHostedEnabledError ||
      shouldRender
    ) {
      return;
    }
    navigate(ROUTES.errors.envError(), { replace: true });
  }, [
    envLoading,
    isGettingSelfHostedEnabled,
    navigate,
    selfHostedEnabledError,
    selfHostedEnabledQuery,
    shouldRender,
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
