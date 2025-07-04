import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { QueryClientConfig } from "@tanstack/react-query";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDebug } from "../NotifyContext";
import { ApiError } from "@landscape/types";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ApiError>;
  }
}

interface ReactQueryProviderProps {
  readonly children: ReactNode;
}

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ children }) => {
  const debug = useDebug();

  const config: QueryClientConfig = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
    queryCache: new QueryCache({ onError: debug }),
  };

  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
