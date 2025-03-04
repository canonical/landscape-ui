import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { Autoinstall } from "../types";

interface AutoinstallFileCreateParams {
  filename: string;
  contents: string;
}

export const useAutoinstallFileCreate = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: AutoinstallFileCreateParams) =>
      authFetch.post<Autoinstall>("/autoinstall", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    createAutoinstallFile: mutateAsync,
    isAutoinstallFileCreating: isPending,
  };
};
