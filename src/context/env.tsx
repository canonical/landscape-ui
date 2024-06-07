import axios from "axios";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL, IS_DEV_ENV } from "@/constants";

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
  const [searchParams] = useSearchParams();

  const selfHostedSearchParam = searchParams.get("self-hosted");
  const isSearchParamDependent =
    IS_DEV_ENV &&
    (selfHostedSearchParam === "true" || selfHostedSearchParam === "false");

  useEffect(() => {
    (async () => {
      const {
        data: { self_hosted },
      } = isSearchParamDependent
        ? { data: { self_hosted: selfHostedSearchParam === "true" } }
        : await axios.get<{ self_hosted: boolean }>(`${API_URL}is-self-hosted`);

      setState({
        isSaas: !self_hosted,
        isSelfHosted: self_hosted,
      });
    })();
  }, [isSearchParamDependent, selfHostedSearchParam]);

  return <EnvContext.Provider value={state}>{children}</EnvContext.Provider>;
};

export default EnvProvider;
