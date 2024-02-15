import useFetchOld from "./useFetchOld";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GPGKey } from "../types/GPGKey";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { ApiError } from "../types/ApiError";

interface GetGPGKeysParams {
  names?: string[];
}

interface ImportGPGKeyParams {
  material: string;
  name: string;
}

interface RemoveGPGKeyParams {
  name: string;
}

interface UseGPGKeysResult {
  getGPGKeysQuery: QueryFnType<AxiosResponse<GPGKey[]>, GetGPGKeysParams>;
  importGPGKeyQuery: UseMutationResult<
    AxiosResponse<GPGKey>,
    AxiosError<ApiError>,
    ImportGPGKeyParams
  >;
  removeGPGKeyQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveGPGKeyParams
  >;
}

export default function useGPGKeys(): UseGPGKeysResult {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
  const debug = useDebug();

  const getGPGKeysQuery: QueryFnType<
    AxiosResponse<GPGKey[]>,
    GetGPGKeysParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<GPGKey[]>, AxiosError<ApiError>>({
      queryKey: ["gpgKeys"],
      queryFn: () =>
        authFetch!.get("GetGPGKeys", {
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
    mutationFn: (params) => authFetch!.get("ImportGPGKey", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["gpgKeys"]).catch(debug);
    },
  });

  const removeGPGKeyQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveGPGKeyParams
  >({
    mutationKey: ["gpgKeys", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveGPGKey", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["gpgKeys"]).catch(debug);
    },
  });

  return { getGPGKeysQuery, importGPGKeyQuery, removeGPGKeyQuery };
}
