import LoadingState from "@/components/layout/LoadingState";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { LoginMethodsLayout, useGetLoginMethods } from "@/features/auth";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import { useAcceptInvitation } from "../../api";
import InvitationRegistrationForm from "../InvitationRegistrationForm";
import { useState, type FC } from "react";

interface InvitationWelcomeProps {
  readonly accountTitle: string;
}

const InvitationWelcome: FC<InvitationWelcomeProps> = ({ accountTitle }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  const { acceptInvitation, isAcceptingInvitation } = useAcceptInvitation();

  const isPamEnabled = Boolean(
    loginMethods?.pam.available && loginMethods.pam.enabled,
  );
  const isPasswordEnabled = Boolean(
    loginMethods?.password.available && loginMethods.password.enabled,
  );
  if (loginMethodsLoading) {
    return <LoadingState />;
  }

  if (
    isRegistering &&
    !isLoginMethodsError &&
    (isPamEnabled || isPasswordEnabled)
  ) {
    return (
      <InvitationRegistrationForm
        accountTitle={accountTitle}
        isPamEnabled={isPamEnabled}
        isPasswordEnabled={isPasswordEnabled}
        isAcceptingInvitation={isAcceptingInvitation}
        acceptInvitation={acceptInvitation}
        onSignIn={() => {
          setIsRegistering(false);
        }}
      />
    );
  }

  return (
    <AuthTemplate title={`You have been invited to ${accountTitle}`}>
      {isLoginMethodsError ? (
        <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
      ) : (
        <LoginMethodsLayout methods={loginMethods} />
      )}
    </AuthTemplate>
  );
};

export default InvitationWelcome;
