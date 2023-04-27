import { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "./ApiError";

export type QueryFnType<Result, Params> = (
  queryParams?: Params,
  config?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => UseQueryResult<Result, AxiosError<ApiError>>;
