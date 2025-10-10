import axios from "axios";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { API_URL, IS_SELF_HOSTED_ENV } from "@/constants";
import useDebug from "@/hooks/useDebug";

interface AboutResponse {
  self_hosted: boolean;
  package_version: string;
  revision: string;
  display_disa_stig_banner: boolean;
}

export interface EnvContextState {
  envLoading: boolean;
  isSaas: boolean;
  isSelfHosted: boolean;
  packageVersion: string;
  revision: string;
  displayDisaStigBanner: boolean;
}

const initialState: EnvContextState = {
  envLoading: true,
  isSaas: false,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

export const EnvContext = createContext<EnvContextState>(initialState);

interface EnvProviderProps {
  readonly children: ReactNode;
}

const EnvProvider: FC<EnvProviderProps> = ({ children }) => {
  const [state, setState] = useState<EnvContextState>(initialState);
  const debug = useDebug();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<AboutResponse>(`${API_URL}about`);
        setState({
          envLoading: false,
          isSaas:
            undefined !== IS_SELF_HOSTED_ENV
              ? ["false", "0"].includes(IS_SELF_HOSTED_ENV)
              : !data.self_hosted,
          isSelfHosted:
            undefined !== IS_SELF_HOSTED_ENV
              ? ["true", "1"].includes(IS_SELF_HOSTED_ENV)
              : data.self_hosted,
          packageVersion: data.package_version,
          revision: data.revision,
          displayDisaStigBanner: data.display_disa_stig_banner,
        });
      } catch (error) {
        debug(error);
      }
    })();
  }, [debug]);

  return <EnvContext.Provider value={state}>{children}</EnvContext.Provider>;
};

export default EnvProvider;
