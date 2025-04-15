import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { DeleteEmployeeParams } from "../../types";

const useDeleteEmployee = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    DeleteEmployeeParams
  >({
    mutationKey: ["employee", "delete"],
    mutationFn: async ({ id }) => authFetch.delete(`employees/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    deleteEmployee: mutateAsync,
    isPending,
  };
};

export default useDeleteEmployee;
