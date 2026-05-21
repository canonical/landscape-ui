import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import useAdministrators from "@/hooks/useAdministrators";
import usePageParams from "@/hooks/usePageParams";
import AdministratorsTabs from "@/pages/dashboard/settings/administrators/AdministratorsTabs";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const InviteAdministratorForm = lazy(
  () =>
    import("@/pages/dashboard/settings/administrators/tabs/administrators/InviteAdministratorForm"),
);

const EditAdministratorForm = lazy(
  () =>
    import("@/pages/dashboard/settings/administrators/tabs/administrators/EditAdministratorForm"),
);

const AdministratorsPage: FC = () => {
  useSetDynamicFilterValidation("sidePath", ["invite", "edit"]);
  const { lastSidePathSegment, name, popSidePathUntilClear, createSidePathPusher } = usePageParams();
  const { getAdministratorsQuery } = useAdministrators();
  const { data: getAdministratorsQueryResult } = getAdministratorsQuery();
  const administrators = getAdministratorsQueryResult?.data ?? [];
  const viewAdministrator = administrators.find((a) => a.email === name);

  return (
    <PageMain>
      <PageHeader
        title="Administrators"
        actions={[
          <Button
            appearance="positive"
            key="invite-administrator"
            onClick={createSidePathPusher("invite")}
            type="button"
          >
            Invite administrator
          </Button>,
        ]}
      />
      <PageContent hasTable>
        <AdministratorsTabs />
      </PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "invite" ||
          (lastSidePathSegment === "edit" && !!viewAdministrator)
        }
      >
        {lastSidePathSegment === "invite" && (
          <SidePanel.Suspense key="invite">
            <SidePanel.Header>Invite administrator</SidePanel.Header>
            <SidePanel.Content>
              <InviteAdministratorForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && viewAdministrator && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>{viewAdministrator.name}</SidePanel.Header>
            <SidePanel.Content>
              <EditAdministratorForm administrator={viewAdministrator} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default AdministratorsPage;
