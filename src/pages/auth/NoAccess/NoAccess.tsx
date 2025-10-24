import useAuth from "@/hooks/useAuth";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const NoAccess: FC = () => {
  const { logout } = useAuth();

  return (
    <AuthTemplate title="You don't have access to this organization">
      <p className="u-text--muted">
        Contact an administrator to get invited to this organization.
      </p>
      <Button
        appearance="positive"
        className="u-no-margin--bottom"
        onClick={logout}
        type="button"
      >
        Log out
      </Button>
    </AuthTemplate>
  );
};

export default NoAccess;
