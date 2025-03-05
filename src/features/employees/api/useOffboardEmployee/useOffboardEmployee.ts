import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { OffboardEmployeeParams } from "../../types";
import type { Activity } from "@/features/activities";

const useOffboardEmployee = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    OffboardEmployeeParams
  >({
    mutationKey: ["employee", "offboard"],
    mutationFn: ({ id }) => authFetch.post(`employees/${id}/offboard`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employee"] }),
  });

  return {
    offboardEmployee: mutateAsync,
    isPending,
  };
};

export default useOffboardEmployee;
