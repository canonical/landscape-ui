import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import useAdministrators from "@/hooks/useAdministrators";
import useSidePanel from "@/hooks/useSidePanel";
import AdministratorsPanelContent from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorsPanelContent";

const InviteAdministratorForm = lazy(
  () =>
    import(
      "@/pages/dashboard/settings/administrators/tabs/administrators/InviteAdministratorForm"
    ),
);

const AdministratorsPanel: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getAdministratorsQuery } = useAdministrators();

  const {
    data: getAdministratorsQueryResult,
    isLoading: getAdministratorsQueryIsLoading,
  } = getAdministratorsQuery();

  const handleInviteAdministrator = () => {
    setSidePanelContent(
      "Invite administrator",
      <Suspense fallback={<LoadingState />}>
        <InviteAdministratorForm />
      </Suspense>,
    );
  };

  return (
    <>
      {getAdministratorsQueryIsLoading && <LoadingState />}
      {!getAdministratorsQueryIsLoading &&
        (!getAdministratorsQueryResult ||
          !getAdministratorsQueryResult.data.length) && (
          <EmptyState
            body={
              <>
                <p>
                  There are no administrators in your Landscape organization.
                </p>
                <a
                  href="https://ubuntu.com/landscape/docs/administrators"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage administrators in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                type="button"
                appearance="positive"
                key="invite-administrator"
                onClick={handleInviteAdministrator}
              >
                Invite Administrator
              </Button>,
            ]}
            icon="user"
            title="No administrators found"
          />
        )}
      {!getAdministratorsQueryIsLoading &&
        getAdministratorsQueryResult &&
        getAdministratorsQueryResult.data.length > 0 && (
          <AdministratorsPanelContent
            administrators={getAdministratorsQueryResult.data}
          />
        )}
    </>
  );
};

export default AdministratorsPanel;
