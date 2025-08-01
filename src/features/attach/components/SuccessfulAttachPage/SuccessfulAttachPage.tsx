import AuthTemplate from "@/templates/auth";
import type { FC } from "react";

const SuccessfulAttachPage: FC = () => {
  return (
    <AuthTemplate title="Sign in successful">
      <p className="u-text--muted">
        You can close this tab and go back to the Ubuntu installer.
      </p>
    </AuthTemplate>
  );
};

export default SuccessfulAttachPage;
