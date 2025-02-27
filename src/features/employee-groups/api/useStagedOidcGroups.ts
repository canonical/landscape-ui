import useFetch from "@/hooks/useFetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { OidcGroupImportSession, StagedOidcGroup } from "../types";
import { useEffect, useState } from "react";
import useDebug from "@/hooks/useDebug";
import type { ApiListResponse } from "@/types/ApiListResponse";

export const useStagedOidcGroups = (issuerId: number) => {
  const [session, setSession] = useState<OidcGroupImportSession | null>(null);

  const authFetch = useFetch();
  const debug = useDebug();

  const { mutateAsync: getSession, isPending } = useMutation({
    mutationFn: (issuerId: number) =>
      authFetch.post<OidcGroupImportSession>("/oidc/groups/import_session", {
        issuer_id: issuerId,
      }),
  });

  useEffect(() => {
    getSession(issuerId)
      .then(({ data }) => {
        setSession(data);
      })
      .catch(debug);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["stagedOidcGroups", { import_session_id: session?.id }],
    queryFn: () =>
      authFetch.get<ApiListResponse<StagedOidcGroup>>("/oidc/groups/staged", {
        params: { import_session_id: session?.id },
      }),
    enabled: session !== null,
  });

  return {
    stagedOidcGroups: data?.data.results ?? [],
    isStagedOidcGroupsLoading: isPending || isLoading,
  };
};
