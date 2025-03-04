import useFetch from "@/hooks/useFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEmployeeGroupDelete = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (employeeGroupId: number) =>
      authFetch.delete(`/employee_groups/${employeeGroupId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    deleteEmployeeGroup: mutateAsync,
    isEmployeeGroupDeleting: isPending,
  };
};
