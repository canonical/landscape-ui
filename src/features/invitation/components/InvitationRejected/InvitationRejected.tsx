import AuthTemplate from "@/templates/auth/AuthTemplate";
import type { FC } from "react";

const InvitationRejected: FC = () => {
  return (
    <AuthTemplate title="You have rejected the invitation">
      <p className="u-text--muted u-no-margin--bottom">
        If this was a mistake, please contact your administrator.
      </p>
      <p className="u-text--muted u-no-margin--bottom">
        You can now close this tab.
      </p>
    </AuthTemplate>
  );
};

export default InvitationRejected;
