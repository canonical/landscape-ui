import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeActionWithInstanceParams } from "../types";

export const useDisassociateEmployeeFromInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    EmployeeActionWithInstanceParams
  >({
    mutationKey: ["employee", "disassociate"],
    mutationFn: async ({ employee_id, computer_id }) =>
      authFetch.delete(`employees/${employee_id}/computers/${computer_id}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["instances", variables.computer_id],
      });
    },
  });

  return {
    disassociateEmployeeFromInstance: mutateAsync,
    isDisassociating: isPending,
  };
};
