import type { Local, ListLocalsResponse } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const FETCH_PAGE_SIZE = 1000;

export const useGetLocals = () => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Local[], AxiosError<ApiError>>({
    queryKey: ["locals", "all"],
    queryFn: async () => {
      const response = await authFetchDebArchive.get<ListLocalsResponse>(
        "locals",
        { params: { pageSize: FETCH_PAGE_SIZE } },
      );

      return response.data.locals ?? [];
    },
  });

  return {
    locals: data ?? [],
    isGettingLocals: isLoading,
  };
};
