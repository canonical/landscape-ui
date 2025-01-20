// import useFetch from "@/hooks/useFetch";
import { ApiError } from "@/types/ApiError";
import {
  useQuery,
  //   useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Employee, RecoveryKey } from "../types";
import { employees, recoveryKey } from "@/tests/mocks/employees";
import { QueryFnType } from "@/types/QueryFnType";

export interface GetEmployeesParams {
  id: number;
}

export default function useEmployees() {
  //   const authFetch = useFetch();
  //   const queryClient = useQueryClient();

  const getEmployeesQuery = (
    { id }: GetEmployeesParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<Employee[]>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<AxiosResponse<Employee[]>, AxiosError<ApiError>>({
      queryKey: ["employee", id],
      //   queryFn: () => authFetch.get(`employee_groups/${id}/employees`),
      queryFn: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: employees,
              status: 200,
              statusText: "OK",
              headers: {},
              config: {},
            } as AxiosResponse<Employee[]>);
          }, 200); // Simulate delay
        }),
      ...config,
    });
  };

  const getRecoveryKey: QueryFnType<
    AxiosResponse<RecoveryKey>,
    Record<never, unknown>
  > = (_, config = {}) => {
    return useQuery<AxiosResponse<RecoveryKey>, AxiosError<ApiError>>({
      queryKey: ["recoveryKey"],
      //   queryFn: () => authFetch.get(`employee_groups/${id}/employees`),
      queryFn: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: recoveryKey,
              status: 200,
              statusText: "OK",
              headers: {},
              config: {},
            } as AxiosResponse<RecoveryKey>);
          }, 200); // Simulate delay
        }),
      ...config,
    });
  };

  return {
    getEmployeesQuery,
    getRecoveryKey,
  };
}
