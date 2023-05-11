import useFetch from "./useFetch";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Series } from "../types/Series";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";

export interface CreateSeriesParams {
  mirror_series: string;
  name: string;
  distribution: string;
  pockets: string[];
  components: string[];
  architectures: string[];
  mirror_uri: string;
  gpg_key: string;
  mirror_gpg_key?: string;
  include_udeb?: boolean;
}

interface UseSeriesResult {
  createSeriesQuery: UseMutationResult<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >;
}

export default function useSeries(): UseSeriesResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

  const createSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >({
    mutationKey: ["series", "new"],
    mutationFn: (params) => authFetch!.get("CreateSeries", { params }),
    onSuccess: () => {
      queryClient.fetchQuery(["distributions"]).then(debug);
    },
  });

  return { createSeriesQuery };
}
