import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import AdministratorsTabs from "@/pages/dashboard/settings/administrators/AdministratorsTabs";

const InviteAdministratorForm = lazy(
  () =>
    import(
      "@/pages/dashboard/settings/administrators/tabs/administrators/InviteAdministratorForm"
    ),
);

const AdministratorsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleInviteAdministrator = () => {
    setSidePanelContent(
      "Invite administrator",
      <Suspense fallback={<LoadingState />}>
        <InviteAdministratorForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Administrators"
        actions={[
          <Button
            appearance="positive"
            key="invite-administrator"
            onClick={handleInviteAdministrator}
            type="button"
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
