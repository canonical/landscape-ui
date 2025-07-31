import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetTags = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<string>>,
    AxiosError<ApiError>
  >({
    queryKey: ["instanceTags"],
    queryFn: async () => authFetch.get("tags"),
  });

  return {
    tags: response?.data.results ?? [],
    tagsCount: response?.data.count,
    isGettingTags: isPending,
  };
};
