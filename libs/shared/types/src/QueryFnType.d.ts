import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiError } from "./api/ApiError";

export type QueryFnType<Result, Params> = (
  queryParams?: Params,
  config?: Omit<
    UseQueryOptions<Result, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => UseQueryResult<Result, AxiosError<ApiError>>;

export type QueryFnTypeWithRequiredParam<Result, Params> = (
  queryParams: Params,
  config?: Omit<
    UseQueryOptions<Result, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => UseQueryResult<Result, AxiosError<ApiError>>;
