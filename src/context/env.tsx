import axios from "axios";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { API_URL, IS_SELF_HOSTED_ENV } from "@/constants";

interface AboutResponse {
  self_hosted: boolean;
  package_version: string;
  revision: string;
}

const initialState = {
  envLoading: true,
  isSaas: false,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
};

export const EnvContext = createContext(initialState);

interface EnvProviderProps {
  readonly children: ReactNode;
}

const EnvProvider: FC<EnvProviderProps> = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
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
      });
    })();
  }, []);

  return <EnvContext.Provider value={state}>{children}</EnvContext.Provider>;
};

export default EnvProvider;
