import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  LocalServiceGetLocalError,
  LocalServiceGetLocalResponse,
} from "@canonical/landscape-openapi";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetLocalRepository = (localId: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data } = useSuspenseQuery<
    AxiosResponse<LocalServiceGetLocalResponse>,
    AxiosError<LocalServiceGetLocalError>
  >({
    queryKey: ["local", localId],
    queryFn: async () => authFetchDebArchive.get(`locals/${localId}`),
  });

  return data?.data;
};
