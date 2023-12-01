import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import useFetch from "./useFetch";
import { Administrator } from "../types/Administrator";

interface useAdministratorsResult {
  getAdministratorsQuery: QueryFnType<AxiosResponse<Administrator[]>, {}>;
}

export default function useAdministrators(): useAdministratorsResult {
  const authFetch = useFetch();

  const getAdministratorsQuery: QueryFnType<
    AxiosResponse<Administrator[]>,
    {}
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Administrator[]>, AxiosError<ApiError>>({
      queryKey: ["administrator"],
      queryFn: () =>
        authFetch!.get("GetAdministrators", { params: queryParams }),
      ...config,
    });

  return { getAdministratorsQuery };
}
