import axios from "axios";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { API_URL, IS_DEV_ENV, IS_SELF_HOSTED_ENV } from "@/constants";

const initialState = {
  isSaas: false,
  isSelfHosted: false,
};

export const EnvContext = createContext(initialState);

interface EnvProviderProps {
  children: ReactNode;
}

const EnvProvider: FC<EnvProviderProps> = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    (async () => {
      const {
        data: { self_hosted },
      } = IS_DEV_ENV
        ? { data: { self_hosted: "true" === IS_SELF_HOSTED_ENV } }
        : await axios.get<{ self_hosted: boolean }>(`${API_URL}is-self-hosted`);

      setState({
        isSaas: !self_hosted,
        isSelfHosted: self_hosted,
      });
    })();
  }, []);

  return <EnvContext.Provider value={state}>{children}</EnvContext.Provider>;
};

export default EnvProvider;
