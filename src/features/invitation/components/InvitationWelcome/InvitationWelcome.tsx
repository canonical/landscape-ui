import LoadingState from "@/components/layout/LoadingState";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { LoginMethodsLayout, useGetLoginMethods } from "@/features/auth";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import { type FC } from "react";

interface InvitationWelcomeProps {
  readonly accountTitle: string;
}

const InvitationWelcome: FC<InvitationWelcomeProps> = ({ accountTitle }) => {
  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  return (
    <AuthTemplate title={`You have been invited to ${accountTitle}`}>
      {loginMethodsLoading && <LoadingState />}

      {isLoginMethodsError ? (
        <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
      ) : (
        <LoginMethodsLayout methods={loginMethods} />
      )}
    </AuthTemplate>
  );
};

export default InvitationWelcome;
