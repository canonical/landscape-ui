import type { Local, ListLocalsResponse } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UseGetLocalsReturnType {
  locals: Local[];
  isGettingLocals: boolean;
}

const useGetLocals = (): UseGetLocalsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Local[], AxiosError<ApiError>>({
    queryKey: ["locals", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const locals: Local[] = [];

      do {
        const response = await authFetchDebArchive.get<ListLocalsResponse>(
          "locals",
          {
            params: {
              pageSize: 100,
              pageToken,
            },
          },
        );

        locals.push(...(response.data.locals ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return locals;
    },
  });

  return {
    locals: data ?? [],
    isGettingLocals: isLoading,
  };
};

export default useGetLocals;
