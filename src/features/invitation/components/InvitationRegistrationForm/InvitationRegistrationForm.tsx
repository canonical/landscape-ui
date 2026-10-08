import { Button } from "@canonical/react-components";
import type { FC } from "react";
import {
  PamUserForm,
  type PamUserFormValues,
  PasswordUserForm,
  type PasswordUserFormValues,
} from "@/features/account-creation";
import { useInvitation } from "@/features/auth";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import useDebug from "@/hooks/useDebug";
import type { useAcceptInvitation } from "../../api/useAcceptInvitation";

interface InvitationRegistrationFormProps {
  readonly accountTitle: string;
  readonly isPamEnabled: boolean;
  readonly isPasswordEnabled: boolean;
  readonly isAcceptingInvitation: boolean;
  readonly registerWithInvitation: ReturnType<
    typeof useAcceptInvitation
  >["registerWithInvitation"];
  readonly onSignIn: () => void;
}

const InvitationRegistrationForm: FC<InvitationRegistrationFormProps> = ({
  accountTitle,
  isPamEnabled,
  isPasswordEnabled,
  isAcceptingInvitation,
  registerWithInvitation,
  onSignIn,
}) => {
  const debug = useDebug();
  const { invitationId } = useInvitation();

  const handleRegister = async (values: PamUserFormValues) => {
    try {
      await registerWithInvitation({
        ...values,
        invitation_id: invitationId,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleLocalRegister = async (values: PasswordUserFormValues) => {
    try {
      await registerWithInvitation({
        ...values,
        invitation_id: invitationId,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <AuthTemplate
      title={
        isPamEnabled
          ? `Create a PAM user to join ${accountTitle}`
          : `Create a user to join ${accountTitle}`
      }
    >
      {isPamEnabled && (
        <PamUserForm
          onSubmit={handleRegister}
          submitButtonText="Create user"
          submitting={isAcceptingInvitation}
        />
      )}
      {!isPamEnabled && isPasswordEnabled && (
        <PasswordUserForm
          onSubmit={handleLocalRegister}
          submitButtonText="Create user"
          submitting={isAcceptingInvitation}
        />
      )}
      <Button
        type="button"
        appearance="link"
        className="u-margin--bottom"
        onClick={onSignIn}
      >
        Already have an account? Sign in here
      </Button>
    </AuthTemplate>
  );
};

export default InvitationRegistrationForm;
