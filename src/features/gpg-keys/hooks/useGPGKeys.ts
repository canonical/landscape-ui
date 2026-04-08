import useFetchOld from "@/hooks/useFetchOld";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  GetGPGKeysParams,
  GPGKey,
  ImportGPGKeyParams,
  RemoveGPGKeyParams,
} from "../types";

export default function useGPGKeys() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getGPGKeysQuery: QueryFnType<
    AxiosResponse<GPGKey[]>,
    GetGPGKeysParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<GPGKey[]>, AxiosError<ApiError>>({
      queryKey: ["gpgKeys"],
      queryFn: async () =>
        authFetchOld.get("GetGPGKeys", {
          params: queryParams,
        }),
      ...config,
    });

  const importGPGKeyQuery = useMutation<
    AxiosResponse<GPGKey>,
    AxiosError<ApiError>,
    ImportGPGKeyParams
  >({
    mutationKey: ["gpgKeys", "new"],
    mutationFn: async (params) => authFetch.post("gpg-key", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["gpgKeys"] }),
  });

  const removeGPGKeyQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveGPGKeyParams
  >({
    mutationKey: ["gpgKeys", "remove"],
    mutationFn: async (params) => authFetchOld.get("RemoveGPGKey", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["gpgKeys"] }),
  });

  return { getGPGKeysQuery, importGPGKeyQuery, removeGPGKeyQuery };
}
