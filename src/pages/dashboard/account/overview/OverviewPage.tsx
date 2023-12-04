import { Button, Icon } from "@canonical/react-components";
import { FC, Suspense } from "react";
import LoadingState from "../../../../components/layout/LoadingState";
import useAuth from "../../../../hooks/useAuth";
import useSidePanel from "../../../../hooks/useSidePanel";
import EditAccountForm from "./EditAccountForm";
import { AuthUser } from "../../../../context/auth";
import PageHeader from "../../../../components/layout/PageHeader";
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
    <>
      <PageHeader
        title="My account"
        actions={[
          <Button
            key="my-account-edit-button"
            hasIcon
            type="button"
            onClick={handleEditAccount}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>,
        ]}
      />
    </>
  );
};

export default OverviewPage;
