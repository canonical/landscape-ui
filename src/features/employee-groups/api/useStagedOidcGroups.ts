import useFetch from "@/hooks/useFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { OidcGroupImportSession, StagedOidcGroup } from "../types";
import { useEffect, useState } from "react";
import useDebug from "@/hooks/useDebug";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useGetEmployeeGroups } from "@/features/employee-groups";

export interface ImportOidcSessionParams {
  readonly issuer_id: number;
}

interface UseStagedOidcGroups {
  readonly issuerId: number;
  readonly pageSize: number;
  readonly currentPage: number;
  readonly search: string;
}

export const useStagedOidcGroups = ({
  issuerId,
  pageSize,
  currentPage,
  search,
}: UseStagedOidcGroups) => {
  const { employeeGroupsCount } = useGetEmployeeGroups();

  const [session, setSession] = useState<OidcGroupImportSession | null>(null);

  const authFetch = useFetch();
  const debug = useDebug();

  const params = {
    import_session_id: session?.id,
    exclude_imported: employeeGroupsCount > 0,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    search,
  };

  const { mutateAsync: getSession, isPending } = useMutation<
    AxiosResponse<OidcGroupImportSession>,
    AxiosError<ApiError>,
    ImportOidcSessionParams
  >({
    mutationFn: async ({ issuer_id }) =>
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
    queryKey: ["stagedOidcGroups", params],
    queryFn: async () =>
      authFetch.get("/oidc/groups/staged", {
        params,
      }),
    enabled: session !== null,
  });

  return {
    stagedOidcGroups: data?.data.results ?? [],
    stagedOidcGroupsCount: data?.data.count ?? 0,
    isStagedOidcGroupsLoading: isPending || isLoading,
  };
};
