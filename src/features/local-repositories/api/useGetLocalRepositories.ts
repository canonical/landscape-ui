import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Local } from "../types";

interface ListLocalsResponse {
  locals: Local[];
  next_page_token: string;
}

export const useGetLocalRepositories = (search?: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<Local[], AxiosError<ApiError>>(
    {
      queryKey: ["locals", search],
      queryFn: async () => {
        let page_token: string | undefined;
        const repositories: Local[] = [];

        do {
          const response = await authFetchDebArchive.get<ListLocalsResponse>(
            "locals",
            {
              params: {
                filter: search ? `display_name="*${search}*"` : undefined,
                page_size: 1000,
                page_token,
              },
            },
          );

          repositories.push(...(response.data.locals ?? []));
          page_token = response.data.next_page_token;
        } while (page_token);

        return repositories;
      },
    },
  );

  return {
    repositories: data ?? [],
    isGettingRepositories: isPending,
  };
};
