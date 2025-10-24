import { useParams, useSearchParams } from "react-router";
import { useUnsigned } from "@/features/auth";

export default function useInvitation() {
  const { getInvitationSummaryQuery } = useUnsigned();

  const { secureId } = useParams<{ secureId: string }>();
  const [searchParams] = useSearchParams();

  const invitationId = secureId || searchParams.get("invitation_id") || "";

  const { data, isLoading } = getInvitationSummaryQuery(
    { invitationId },
    { enabled: !!invitationId },
  );

  return {
    invitationId,
    isLoading,
    invitationAccount: data?.data ?? null,
  };
}
