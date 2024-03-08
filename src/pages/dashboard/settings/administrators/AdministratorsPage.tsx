import { FC } from "react";
import PageMain from "../../../../components/layout/PageMain";
import PageHeader from "../../../../components/layout/PageHeader";
import PageContent from "../../../../components/layout/PageContent";
import AdministratorsTabs from "./AdministratorsTabs";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import InviteAdministratorForm from "./tabs/administrators/InviteAdministratorForm";

const AdministratorsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleInviteAdministrator = () => {
    setSidePanelContent("Invite administrator", <InviteAdministratorForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Administrators"
        actions={[
          <Button
            key="invite-administrator"
            type="button"
            onClick={handleInviteAdministrator}
          >
            Invite administrator
          </Button>,
        ]}
      />
      <PageContent>
        <AdministratorsTabs />
      </PageContent>
    </PageMain>
  );
};

export default AdministratorsPage;
