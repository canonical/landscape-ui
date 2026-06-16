import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

interface OperationResource {
  readonly name: string;
  readonly displayName: string;
  readonly lastOperation: string;
}

export const useGetOperationResource = (name: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, error } = useSuspenseQuery<AxiosResponse<OperationResource>>({
    queryKey: ["operation", name],
    queryFn: async () => authFetchDebArchive.get(name),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.data;
};
