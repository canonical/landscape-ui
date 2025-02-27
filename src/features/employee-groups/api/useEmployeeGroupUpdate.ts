import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { EmployeeGroup } from "@/features/employee-groups";

interface EmployeeGroupUpdateParams {
  employeeGroupId: number;
  autoinstall_file_filename?: string;
  priority?: number;
}

export const useEmployeeGroupUpdate = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ employeeGroupId, ...params }: EmployeeGroupUpdateParams) =>
      authFetch.patch<EmployeeGroup>(
        `/employee_groups/${employeeGroupId}`,
        params,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    updateEmployeeGroup: mutateAsync,
    isEmployeeGroupUpdating: isPending,
  };
};
