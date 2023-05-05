import useFetch from "./useFetch";
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
  name: string;
  material: string;
}

interface RemoveGPGKeyParams {
  name: string;
}

interface UseGPGKeysResult {
  getGPGKeysQuery: QueryFnType<GPGKey[], GetGPGKeysParams>;
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
  const authFetch = useFetch();
  const debug = useDebug();

  const getGPGKeysQuery: QueryFnType<GPGKey[], GetGPGKeysParams> = (
    queryParams = {},
    config = {}
  ) =>
    // @ts-ignore
    useQuery<AxiosResponse<GPGKey[]>, AxiosError<ApiError>>({
      // @ts-ignore
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
      queryClient.fetchQuery(["gpgKeys"]).then(debug);
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
      queryClient.fetchQuery(["gpgKeys"]).then(debug);
    },
  });

  return { getGPGKeysQuery, importGPGKeyQuery, removeGPGKeyQuery };
}
