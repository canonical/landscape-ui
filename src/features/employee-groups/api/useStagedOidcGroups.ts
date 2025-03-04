import useFetch from "@/hooks/useFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { OidcGroupImportSession, StagedOidcGroup } from "../types";
import { useEffect, useState } from "react";
import useDebug from "@/hooks/useDebug";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

export interface ImportOidcSessionParams {
  readonly issuer_id: number;
}

export const useStagedOidcGroups = (issuerId: number) => {
  const [session, setSession] = useState<OidcGroupImportSession | null>(null);

  const authFetch = useFetch();
  const debug = useDebug();

  const { mutateAsync: getSession, isPending } = useMutation<
    AxiosResponse<OidcGroupImportSession>,
    AxiosError<ApiError>,
    ImportOidcSessionParams
  >({
    mutationFn: ({ issuer_id }) =>
      authFetch.post("/oidc/groups/import_session", {
        issuer_id,
      }),
  });

  useEffect(() => {
    getSession({ issuer_id: issuerId })
      .then(({ data }) => {
        setSession(data);
      })
      .catch(debug);
  }, []);

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<StagedOidcGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["stagedOidcGroups", { import_session_id: session?.id }],
    queryFn: () =>
      authFetch.get("/oidc/groups/staged", {
        params: { import_session_id: session?.id },
      }),
    enabled: session !== null,
  });

  return {
    stagedOidcGroups: data?.data.results ?? [],
    isStagedOidcGroupsLoading: isPending || isLoading,
  };
};
