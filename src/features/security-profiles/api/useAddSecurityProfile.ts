import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { SecurityProfile } from "../types";

export interface AddSecurityProfileParams
  extends Pick<SecurityProfile, "benchmark" | "mode" | "schedule" | "title">,
    Partial<Pick<SecurityProfile, "access_group" | "all_computers" | "tags">> {
  start_date: string;
  tailoring_file?: string;
}

export const useAddSecurityProfile = (): {
  isSecurityProfileAdding: boolean;
  addSecurityProfile: (
    params: AddSecurityProfileParams,
  ) => Promise<SecurityProfile>;
} => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    SecurityProfile,
    AxiosError<ApiError>,
    AddSecurityProfileParams
  >({
    mutationFn: async (params) => authFetch.post("security-profiles", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["securityProfiles"] }),
  });

  return {
    isSecurityProfileAdding: isPending,
    addSecurityProfile: mutateAsync,
  };
};
