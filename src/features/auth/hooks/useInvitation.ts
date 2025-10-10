import { useParams, useSearchParams } from "react-router";
import { useUnsigned } from "@/features/auth";
import useAuth from "@/hooks/useAuth";

export default function useInvitation() {
  const { getInvitationSummaryQuery } = useUnsigned();
  const { user } = useAuth();

  const { secureId } = useParams<{ secureId: string }>();
  const [searchParams] = useSearchParams();

  const invitationId =
    user?.invitation_id || secureId || searchParams.get("invitation_id") || "";

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
