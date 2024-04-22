import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import useFetch from "./useFetch";
import { Preferences } from "@/types/Preferences";
import useDebug from "./useDebug";

interface ChangeOrganisationPreferencesParams {
  title?: string;
  registration_password?: string;
  auto_register_new_computers?: boolean;
}

export const useOrgSettings = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const debug = useDebug();

  const getOrganisationPreferences: QueryFnType<
    AxiosResponse<Preferences>,
    void
  > = (_, config = {}) =>
    useQuery<AxiosResponse<Preferences>, AxiosError<ApiError>>({
      queryKey: ["preferences"],
      queryFn: () => authFetch!.get("preferences"),
      ...config,
    });

  const changeOrganisationPreferences = useMutation<
    AxiosResponse<Preferences>,
    AxiosError<ApiError>,
    ChangeOrganisationPreferencesParams
  >({
    mutationKey: ["preferences", "change"],
    mutationFn: (params) => authFetch!.patch("preferences", params),
    onSuccess: () => {
      queryClient.invalidateQueries(["preferences"]).catch(debug);
    },
  });

  return {
    getOrganisationPreferences,
    changeOrganisationPreferences,
  };
};
