import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import {
  AdministratorsTabs,
  AdministratorsLimit,
  useGetAdministratorsLimit,
  useAdministrators,
} from "@/features/administrators";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const InviteAdministratorForm = lazy(
  () => import("@/features/administrators/components/InviteAdministratorForm"),
);

const AdministratorsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const { getAdministratorsQuery } = useAdministrators();
  const {
    data: getAdministratorsQueryResult,
    isLoading: getAdministratorsQueryIsLoading,
  } = getAdministratorsQuery();

  const { administratorsLimit, isGettingAdministratorsLimit } =
    useGetAdministratorsLimit();

  const administrators = getAdministratorsQueryResult?.data ?? [];
  const isGettingAdminInfo =
    isGettingAdministratorsLimit || getAdministratorsQueryIsLoading;

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
        actions={
          administrators.length
            ? [
                <Button
                  appearance="positive"
                  key="invite-administrator"
                  onClick={handleInviteAdministrator}
                  type="button"
                  disabled={administrators.length >= administratorsLimit}
                >
                  Invite administrator
                </Button>,
              ]
            : undefined
        }
      />
      {isGettingAdminInfo ? (
        <LoadingState />
      ) : (
        <>
          <AdministratorsLimit
            administratorsCount={administrators.length}
            administratorsLimit={administratorsLimit}
          />
          <PageContent hasTable>
            <AdministratorsTabs administrators={administrators} />
          </PageContent>
        </>
      )}
    </PageMain>
  );
};

export default AdministratorsPage;
