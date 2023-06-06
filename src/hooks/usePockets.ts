import useFetch from "./useFetch";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { Pocket } from "../types/Pocket";

interface CreatePocketParamsCommon {
  name: string;
  series: string;
  distribution: string;
  components: string[];
  architectures: string[];
  gpg_key: string;
  include_udeb: boolean;
}

export interface CreatePocketParamsMirror extends CreatePocketParamsCommon {
  mode: "mirror";
  mirror_uri: string;
  mirror_suite?: string;
  mirror_gpg_key?: string;
}

export interface CreatePocketParamsPull extends CreatePocketParamsCommon {
  mode: "pull";
  pull_pocket: string;
  pull_series?: string;
  filter_type?: "whitelist" | "blacklist";
  filters: string[];
}

export interface CreatePocketParamsUpload extends CreatePocketParamsCommon {
  mode: "upload";
  upload_allow_unsigned: boolean;
}

interface RemovePocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface UsePocketsResult {
  createPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreatePocketParamsMirror | CreatePocketParamsPull | CreatePocketParamsUpload
  >;
  removePocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >;
}

export default function usePockets(): UsePocketsResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

  const createPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreatePocketParamsMirror | CreatePocketParamsPull | CreatePocketParamsUpload
  >({
    mutationKey: ["pockets", "new"],
    mutationFn: (params) => authFetch!.get("CreatePocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distribution"]).catch(debug);
    },
  });

  const removePocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >({
    mutationKey: ["pockets", "remove"],
    mutationFn: (params) => authFetch!.get("RemovePocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distribution"]).catch(debug);
    },
  });

  return {
    createPocketQuery,
    removePocketQuery,
  };
}
