import { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "./ApiError";

export type MutationFnType<Result, Params> = (
  body: Params,
  config?: Omit<UseMutationOptions, "mutationKey" | "mutationFn">
) => UseMutationResult<Result, AxiosError<ApiError>>;
