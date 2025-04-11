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
    mutationFn: ({ employee_id, ...params }) =>
      authFetch.post(`employees/${employee_id}/computers`, params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    associateEmployeeWithInstance: mutateAsync,
    isPending,
  };
};

export default useAssociateEmployeeWithInstance;
