import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useParams, useSearchParams } from "react-router";
import { API_URL } from "@/constants";
import type { InvitationSummary } from "@/types/Invitation";

const publicFetch = axios.create({ baseURL: API_URL });

export default function useGetInvitation() {
  const { secureId } = useParams<{ secureId: string }>();
  const [searchParams] = useSearchParams();

  const invitationId = secureId || searchParams.get("invitation_id") || "";

  const { data, isLoading, error } = useQuery<AxiosResponse<InvitationSummary>>(
    {
      queryKey: ["invitationSummary", { invitationId }],
      queryFn: () =>
        publicFetch.get<InvitationSummary>(
          `/invitations/${invitationId}/summary`,
        ),
      enabled: !!invitationId,
    },
  );

  return {
    invitationId,
    isLoading,
    invitationAccount: data?.data ?? null,
    error,
  };
}
