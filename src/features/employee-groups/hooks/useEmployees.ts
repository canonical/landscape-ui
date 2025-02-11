// import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import {
  useQuery,
  //   useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ConfigurationLimit, Employee, RecoveryKey } from "../types";
import {
  configurationLimit,
  employees,
  recoveryKey,
} from "@/tests/mocks/employees";
import type { QueryFnType } from "@/types/QueryFnType";

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

  const getEmployeesConfigurationLimit: QueryFnType<
    AxiosResponse<ConfigurationLimit>,
    Record<never, unknown>
  > = (_, config = {}) => {
    return useQuery<AxiosResponse<ConfigurationLimit>, AxiosError<ApiError>>({
      queryKey: ["employeesConfigurationLimit"],
      //   queryFn: () => authFetch.get(`employee_groups/${id}/employees`),
      queryFn: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: configurationLimit,
              status: 200,
              statusText: "OK",
              headers: {},
              config: {},
            } as AxiosResponse<ConfigurationLimit>);
          }, 200); // Simulate delay
        }),
      ...config,
    });
  };

  return {
    getEmployeesConfigurationLimit,
    getEmployeesQuery,
    getRecoveryKey,
  };
}
