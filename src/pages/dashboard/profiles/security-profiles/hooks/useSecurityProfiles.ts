import { useSearchParams } from "react-router";
import { useUnsigned } from "@/features/auth";

export default function useSecurityProfiles() {
  const { getInvitationSummaryQuery } = useUnsigned();

  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitation_id") ?? "";

  const { isLoading } = getInvitationSummaryQuery(
    { invitationId: invitationId ?? "" },
    { enabled: !!invitationId },
  );

  return {
    isLoading,
  };
}
