import { useSearchParams } from 'react-router';
import useUnsigned from './useUnsigned';

export default function useInvitation() {
  const { getInvitationSummaryQuery } = useUnsigned();

  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get('invitation_id') ?? '';

  const { data, isLoading } = getInvitationSummaryQuery(
    { invitationId: invitationId ?? '' },
    { enabled: !!invitationId },
  );

  return {
    invitationId,
    isLoading,
    invitationAccount: data?.data ?? null,
  };
}
