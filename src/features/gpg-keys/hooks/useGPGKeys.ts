import useFetchOld from "@/hooks/useFetchOld";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetGPGKeysParams,
  GPGKey,
  ImportGPGKeyParams,
  RemoveGPGKeyParams,
} from "../types";
import type { AxiosError, AxiosResponse } from "axios";
import type { QueryFnType } from "@/types/QueryFnType";
import type { ApiError } from "@/types/ApiError";

export default function useGPGKeys() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const getGPGKeysQuery: QueryFnType<
    AxiosResponse<GPGKey[]>,
    GetGPGKeysParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<GPGKey[]>, AxiosError<ApiError>>({
      queryKey: ["gpgKeys"],
      queryFn: () =>
        authFetch.get("GetGPGKeys", {
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
    mutationFn: (params) => authFetch.get("ImportGPGKey", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gpgKeys"] }),
  });

  const removeGPGKeyQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveGPGKeyParams
  >({
    mutationKey: ["gpgKeys", "remove"],
    mutationFn: (params) => authFetch.get("RemoveGPGKey", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gpgKeys"] }),
  });

  return { getGPGKeysQuery, importGPGKeyQuery, removeGPGKeyQuery };
}
