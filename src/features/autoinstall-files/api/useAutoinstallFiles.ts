import { useQuery } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { Autoinstall } from "../types";

export const useAutoinstallFiles = () => {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery({
    queryKey: ["autoinstallFiles"],
    queryFn: () =>
      authFetch.get<ApiPaginatedResponse<Autoinstall>>("/autoinstall"),
  });

  return {
    autoinstallFiles: data?.data.results ?? [],
    isAutoinstallFilesLoading: isLoading,
  };
};
