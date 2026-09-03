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
import { useBoolean } from "usehooks-ts";

const InviteAdministratorForm = lazy(
  () => import("@/features/administrators/components/InviteAdministratorForm"),
);

const AdministratorLimitModal = lazy(
  () => import("@/features/administrators/components/AdministratorLimitModal"),
);

const AdministratorsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

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
    if (administrators.length >= administratorsLimit) {
      openModal();
    } else {
      setSidePanelContent(
        "Invite administrator",
        <Suspense fallback={<LoadingState />}>
          <InviteAdministratorForm />
        </Suspense>,
      );
    }
  };

  if (isGettingAdminInfo) {
    return <LoadingState />;
  }

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
                >
                  Invite administrator
                </Button>,
              ]
            : undefined
        }
      />
      <AdministratorsLimit
        administratorsCount={administrators.length}
        administratorsLimit={administratorsLimit}
      />
      <PageContent hasTable>
        <AdministratorsTabs administrators={administrators} />
      </PageContent>
      {isModalOpen && (
        <Suspense fallback={<LoadingState centerOnScreen />}>
          <AdministratorLimitModal close={closeModal} />
        </Suspense>
      )}
    </PageMain>
  );
};

export default AdministratorsPage;
