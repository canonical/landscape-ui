import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

interface OperationResource {
  readonly name: string;
  readonly displayName: string;
  readonly lastOperation?: string;
}

export const useGetOperationResource = (name: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data } = useSuspenseQuery<AxiosResponse<OperationResource>>({
    queryKey: ["resource", name],
    queryFn: async () => authFetchDebArchive.get(name),
  });

  return data.data;
};
