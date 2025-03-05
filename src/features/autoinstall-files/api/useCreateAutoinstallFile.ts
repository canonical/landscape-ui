import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import type { AutoinstallFile } from "../types";

interface useCreateAutoinstallFileParams {
  filename: string;
  contents: string;
}

export const useCreateAutoinstallFile = () => {
  const queryClient = useQueryClient();
  const authFetch = useFetch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: useCreateAutoinstallFileParams) =>
      authFetch.post<AutoinstallFile>("/autoinstall", params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] }),
  });

  return {
    createAutoinstallFile: mutateAsync,
    isAutoinstallFileCreating: isPending,
  };
};
