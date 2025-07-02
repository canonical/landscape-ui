import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee, GetEmployeeParams } from "../../types";

const useGetEmployee = (
  queryParams: GetEmployeeParams,
  config: Omit<
    UseQueryOptions<AxiosResponse<Employee, AxiosError<ApiError>>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const { id, ...params } = queryParams;
  const { data, isPending } = useQuery<
    AxiosResponse<Employee>,
    AxiosError<ApiError>
  >({
    queryKey: ["employee", queryParams],
    queryFn: async () => authFetch.get(`employees/${id}`, { params: params }),
    ...config,
  });

  return {
    employee: data?.data,
    isPending,
  };
};

export default useGetEmployee;
