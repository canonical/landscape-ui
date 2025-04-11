import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  Distribution,
  GetDistributionsParams,
  RemoveDistributionParams,
} from "../types";

export interface UseDistributionsResult {
  createDistributionQuery: UseMutationResult<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
  getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  >;
  removeDistributionQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
}
