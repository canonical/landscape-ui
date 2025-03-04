import type { Employee } from "../types";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import useFetch from "@/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeGroupEmployees = (employeeGroupId: number) => {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery({
    queryKey: ["employees", { employeeGroupId }],
    queryFn: () =>
      authFetch.get<ApiPaginatedResponse<Employee>>(
        `/employee_groups/${employeeGroupId}/employees`,
      ),
  });

  return {
    employeeGroup: data?.data.results ?? [],
    isEmployeeGroupFetching: isLoading,
  };
};
