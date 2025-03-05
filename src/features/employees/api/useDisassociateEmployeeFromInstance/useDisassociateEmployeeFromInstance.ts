import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeActionWithInstanceParams } from "../../types";

const useDisassociateEmployeeFromInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    EmployeeActionWithInstanceParams
  >({
    mutationKey: ["employee", "disassociate"],
    mutationFn: ({ employee_id, computer_id }) =>
      authFetch.delete(`employees/${employee_id}/computers/${computer_id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    disassociateEmployeeFromInstance: mutateAsync,
    isPending,
  };
};

export default useDisassociateEmployeeFromInstance;
