import type { AccessGroup } from "@/features/access-groups";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export default function useGetAccessGroup(name: string) {
  const authFetch = useFetchOld();

  const names = [name];

  const { data, isPending, error } = useQuery<
    AxiosResponse<AccessGroup[]>,
    AxiosError<ApiError>
  >({
    queryKey: ["accessGroups", name],
    queryFn: async () =>
      authFetch.get("GetAccessGroups", { params: { names } }),
    enabled: !!name,
  });

  return {
    accessGroup: data?.data[0],
    isGettingAccessGroup: isPending,
    accessGroupError: error,
  };
}
