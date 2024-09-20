import { FC, ReactNode, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import useDebug from "@/hooks/useDebug";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ApiError>;
  }
}

interface ReactQueryProviderProps {
  children: ReactNode;
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
