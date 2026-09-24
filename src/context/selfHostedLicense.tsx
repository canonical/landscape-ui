import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";
import type { ApiError } from "@/types/api/ApiError";
import useEnv from "@/hooks/useEnv";
import { useGetSelfHostedEnabled } from "@/features/self-hosted-license";
import type { AxiosError } from "axios";

interface SelfHostedLicenseContextProps {
  isGettingSelfHostedEnabled: boolean;
  isSelfHostedEnabled: boolean;
  selfHostedEnabledError: AxiosError<ApiError> | null;
}

const initialState: SelfHostedLicenseContextProps = {
  isGettingSelfHostedEnabled: false,
  isSelfHostedEnabled: false,
  selfHostedEnabledError: null,
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

  return (
    <SelfHostedLicenseContext.Provider value={selfHostedLicense}>
      {children}
    </SelfHostedLicenseContext.Provider>
  );
};

export const useSelfHostedLicense = () => useContext(SelfHostedLicenseContext);

export default SelfHostedLicenseProvider;
