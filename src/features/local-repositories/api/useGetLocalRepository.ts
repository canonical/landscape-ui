import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalServiceGetLocalError,
  LocalServiceGetLocalResponse,
} from "@canonical/landscape-openapi";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetLocalRepository = (name: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data } = useSuspenseQuery<
    AxiosResponse<LocalServiceGetLocalResponse>,
    AxiosError<LocalServiceGetLocalError>
  >({
    queryKey: ["local", name],
    queryFn: async () => authFetchDebArchive.get(name),
  });

  return data?.data;
};
