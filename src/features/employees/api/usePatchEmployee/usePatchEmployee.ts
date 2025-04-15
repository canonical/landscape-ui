import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee, PatchEmployeeParams } from "../../types";

const usePatchEmployee = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Employee>,
    AxiosError<ApiError>,
    PatchEmployeeParams
  >({
    mutationKey: ["employee", "patch"],
    mutationFn: async ({ id, ...params }) =>
      authFetch.patch(`employees/${id}`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    patchEmployee: mutateAsync,
    isPending,
  };
};

export default usePatchEmployee;
