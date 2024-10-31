import { useSearchParams } from "react-router-dom";
import { useUnsigned } from "@/features/auth";

export default function useInvitation() {
  const { getInvitationSummaryQuery } = useUnsigned();

  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitation_id") ?? "";

  const { data, isLoading } = getInvitationSummaryQuery(
    { invitationId: invitationId ?? "" },
    { enabled: !!invitationId },
  );

  return {
    invitationId,
    isLoading,
    invitationAccount: data?.data ?? null,
  };
}
