import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/api/QueryFnType";
import type { Preferences } from "@/types/Preferences";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface ChangeOrganisationPreferencesParams {
  title?: string;
  registration_password?: string;
  auto_register_new_computers?: boolean;
}

export default function useOrgSettings() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getOrganisationPreferences: QueryFnType<
    AxiosResponse<Preferences>,
    void
  > = (_, config = {}) =>
    useQuery<AxiosResponse<Preferences>, AxiosError<ApiError>>({
      queryKey: ["preferences"],
      queryFn: async () => authFetch.get("preferences"),
      ...config,
    });

  const changeOrganisationPreferences = useMutation<
    AxiosResponse<Preferences>,
    AxiosError<ApiError>,
    ChangeOrganisationPreferencesParams
  >({
    mutationKey: ["preferences", "change"],
    mutationFn: async (params) => authFetch.patch("preferences", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["preferences"] }),
  });

  return {
    getOrganisationPreferences,
    changeOrganisationPreferences,
  };
}
