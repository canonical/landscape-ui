import { ActionButton } from "@canonical/react-components";
import type { FC } from "react";
import { useSearchParams } from "react-router";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import { HOMEPAGE_PATH } from "@/constants";
import { useInvitation } from "@/features/auth";
import { useAcceptInvitation, useRejectInvitation } from "../../api";
import classNames from "classnames";
import classes from "./InvitationForm.module.scss";

interface InvitationFormProps {
  readonly accountTitle: string;
  readonly onReject: () => void;
}

const InvitationForm: FC<InvitationFormProps> = ({
  accountTitle,
  onReject,
}) => {
  const debug = useDebug();
  const { safeRedirect } = useAuth();
  const [searchParams] = useSearchParams();
  const { invitationId } = useInvitation();
  const { acceptInvitation, isAcceptingInvitation } = useAcceptInvitation();
  const { rejectInvitation, isRejectingInvitation } = useRejectInvitation();

  const handleReject = async () => {
    try {
      await rejectInvitation({ invitation_id: invitationId });
      onReject();
    } catch (error) {
      debug(error);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptInvitation({ invitation_id: invitationId });
      safeRedirect(searchParams.get("redirect-to") ?? HOMEPAGE_PATH, {
        replace: true,
        external: searchParams.has("external"),
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <AuthTemplate
      title={`You have been invited as an administrator for ${accountTitle}`}
    >
      <p className="p-text--small">
        Accepting this invitation will make you an administrator for the{" "}
        {accountTitle} organization.
      </p>
      <ActionButton
        appearance="positive"
        className={classNames(classes.button, "u-no-margin--bottom")}
        onClick={handleAccept}
        type="button"
        disabled={isAcceptingInvitation}
        loading={isAcceptingInvitation}
      >
        Accept
      </ActionButton>
      <ActionButton
        type="button"
        className={classNames(classes.button, "u-no-margin--bottom")}
        onClick={handleReject}
        disabled={isRejectingInvitation}
        loading={isRejectingInvitation}
      >
        Reject
      </ActionButton>
    </AuthTemplate>
  );
};

export default InvitationForm;
