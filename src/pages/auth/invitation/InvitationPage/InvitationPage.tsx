import LoadingState from "@/components/layout/LoadingState";
import { useInvitation } from "@/features/auth";
import {
  InvitationError,
  InvitationWelcome,
  InvitationRejected,
  InvitationForm,
} from "@/features/invitation";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const InvitationPage: FC = () => {
  const navigate = useNavigate();
  const { user, authorized } = useAuth();
  const [hasRejected, setHasRejected] = useState(false);

  const { invitationId, invitationAccount, isLoading } = useInvitation();

  useEffect(() => {
    if (!invitationId) {
      navigate(ROUTES.auth.login(), { replace: true });
    }
  }, [invitationId, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!invitationAccount) {
    return (
      <InvitationError onBackToLogin={() => navigate(ROUTES.auth.login())} />
    );
  }

  if (hasRejected) {
    return <InvitationRejected />;
  }

  if (authorized && user?.invitation_id) {
    return (
      <InvitationForm
        accountTitle={invitationAccount.account_title}
        onReject={() => {
          setHasRejected(true);
        }}
      />
    );
  }

  return <InvitationWelcome accountTitle={invitationAccount.account_title} />;
};

export default InvitationPage;
