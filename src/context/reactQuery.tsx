import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { QueryClientConfig } from "@tanstack/react-query";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useDebug from "@/hooks/useDebug";
import { isAxiosError, type AxiosError } from "axios";
import type { ApiError } from "@/types/api/ApiError";

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
    queryCache: new QueryCache({
      onError: (error, query) => {
        const isHandledByBoundary = query.observers.some(({ options }) => {
          const { throwOnError } = options;

          return typeof throwOnError === "function"
            ? throwOnError(error, query)
            : !!throwOnError;
        });

        const message =
          isAxiosError<ApiError>(error) && error.response
            ? error.response.data?.message
            : error.message;
        if (isHandledByBoundary && !message) {
          return;
        }

        debug(error);
      },
    }),
  };

  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
