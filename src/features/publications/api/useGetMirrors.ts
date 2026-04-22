import type { ListMirrorsResponse, Mirror } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UseGetMirrorsReturnType {
  mirrors: Mirror[];
  isGettingMirrors: boolean;
}

const FETCH_PAGE_SIZE = 1000;
// TODO: remove
const useGetMirrors = (): UseGetMirrorsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Mirror[], AxiosError<ApiError>>({
    queryKey: ["mirrors", "all"],
    queryFn: async () => {
      const response = await authFetchDebArchive.get<ListMirrorsResponse>(
        "mirrors",
        { params: { pageSize: FETCH_PAGE_SIZE } },
      );

      return response.data.mirrors ?? [];
    },
  });

  return {
    mirrors: data ?? [],
    isGettingMirrors: isLoading,
  };
};

export default useGetMirrors;
