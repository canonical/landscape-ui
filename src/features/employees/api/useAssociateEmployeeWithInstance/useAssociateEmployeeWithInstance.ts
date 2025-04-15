import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeActionWithInstanceParams } from "../../types";
import type { Instance } from "@/types/Instance";

const useAssociateEmployeeWithInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Instance>,
    AxiosError<ApiError>,
    EmployeeActionWithInstanceParams
  >({
    mutationKey: ["employee", "associate"],
    mutationFn: async ({ employee_id, ...params }) =>
      authFetch.post(`employees/${employee_id}/computers`, params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["instances", variables.computer_id],
      });
    },
  });

  return {
    associateEmployeeWithInstance: mutateAsync,
    isAssociating: isPending,
  };
};

export default useAssociateEmployeeWithInstance;
