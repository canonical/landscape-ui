import { Button } from "@canonical/react-components";
import type { FC } from "react";
import AuthTemplate from "@/templates/auth/AuthTemplate";

interface InvitationErrorProps {
  readonly onBackToLogin: () => void;
}

const InvitationError: FC<InvitationErrorProps> = ({ onBackToLogin }) => {
  return (
    <AuthTemplate title="Invitation not found">
      <div>
        <p className="p-text--small">
          Unable to load invitation details. Please check your invitation link.
        </p>
        <Button appearance="positive" onClick={onBackToLogin}>
          Back to login
        </Button>
      </div>
    </AuthTemplate>
  );
};

export default InvitationError;
