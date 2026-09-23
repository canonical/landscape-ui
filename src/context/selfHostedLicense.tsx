import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";
import type { ApiError } from "@/types/api/ApiError";
import LoadingState from "@/components/layout/LoadingState";
import useEnv from "@/hooks/useEnv";
import { useGetSelfHostedEnabled } from "@/features/self-hosted-license";
import type { AxiosError } from "axios";

interface SelfHostedLicenseContextProps {
  isGettingSelfHostedEnabled: boolean;
  isSelfHostedEnabled: boolean;
  selfHostedEnabledError: AxiosError<ApiError> | null;
  isProvided: boolean;
}

const initialState: SelfHostedLicenseContextProps = {
  isGettingSelfHostedEnabled: false,
  isSelfHostedEnabled: false,
  selfHostedEnabledError: null,
  isProvided: false,
};

export const SelfHostedLicenseContext =
  createContext<SelfHostedLicenseContextProps>(initialState);

interface SelfHostedLicenseProviderProps {
  readonly children: ReactNode;
}

const SelfHostedLicenseProvider: FC<SelfHostedLicenseProviderProps> = ({
  children,
}) => {
  const { envLoading, isSaas } = useEnv();
  const shouldQuery = !envLoading && isSaas;
  const selfHostedLicense = useGetSelfHostedEnabled(shouldQuery);

  if (
    envLoading ||
    (shouldQuery &&
      selfHostedLicense.isGettingSelfHostedEnabled &&
      !selfHostedLicense.selfHostedEnabledError)
  ) {
    return <LoadingState />;
  }

  return (
    <SelfHostedLicenseContext.Provider
      value={{ ...selfHostedLicense, isProvided: true }}
    >
      {children}
    </SelfHostedLicenseContext.Provider>
  );
};

export const useSelfHostedLicense = (enabled: boolean) => {
  const context = useContext(SelfHostedLicenseContext);
  const localSelfHostedLicense = useGetSelfHostedEnabled(
    enabled && !context.isProvided,
  );

  return context.isProvided ? context : localSelfHostedLicense;
};

export default SelfHostedLicenseProvider;
