import type { ListMirrorsResponse, Mirror } from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UseGetMirrorsReturnType {
  mirrors: Mirror[];
  isGettingMirrors: boolean;
}

const useGetMirrors = (): UseGetMirrorsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Mirror[], AxiosError<ApiError>>({
    queryKey: ["mirrors", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const mirrors: Mirror[] = [];

      do {
        const response = await authFetchDebArchive.get<ListMirrorsResponse>(
          "mirrors",
          {
            params: {
              pageSize: 100,
              pageToken,
            },
          },
        );

        mirrors.push(...(response.data.mirrors ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return mirrors;
    },
  });

  return {
    mirrors: data ?? [],
    isGettingMirrors: isLoading,
  };
};

export default useGetMirrors;
