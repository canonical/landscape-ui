import { Button, Icon } from "@canonical/react-components";
import { FC, Suspense } from "react";
import LoadingState from "../../../../components/layout/LoadingState";
import useAuth from "../../../../hooks/useAuth";
import useSidePanel from "../../../../hooks/useSidePanel";
import EditAccountForm from "./EditAccountForm";
import classes from "./OverviewPage.module.scss";
import { AuthUser } from "../../../../context/auth";
const OverviewPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { user } = useAuth();

  const handleEditAccount = async () => {
    setSidePanelOpen(true);
    setSidePanelContent(
      "Edit Account",
      <Suspense fallback={<LoadingState />}>
        <EditAccountForm user={user as AuthUser} />
      </Suspense>,
    );
  };

  return (
    <div className={classes.header}>
      <p className="p-heading--4">My account</p>
      <Button hasIcon type="button" onClick={handleEditAccount}>
        <Icon name="edit" />
        <span>Edit</span>
      </Button>
    </div>
  );
};

export default OverviewPage;
