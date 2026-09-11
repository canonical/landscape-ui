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
  AdministratorLimitModal,
  InviteAdministratorForm,
} from "@/features/administrators";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { Suspense } from "react";
import { useBoolean } from "usehooks-ts";

const AdministratorsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const { getAdministratorsQuery, getInvitationsQuery } = useAdministrators();
  const { data: administratorsData, isPending: isGettingAdministrators } =
    getAdministratorsQuery();
  const {
    data: invitationsData,
    isPending: isGettingInvitations,
    isError: isInvitationsError,
  } = getInvitationsQuery();

  const {
    administratorsLimit,
    isGettingAdministratorsLimit,
    isAdministratorsError,
  } = useGetAdministratorsLimit();

  const administrators = administratorsData?.data ?? [];
  const invitations = invitationsData?.data.results ?? [];

  const isGettingAdminInfo =
    isGettingAdministratorsLimit ||
    isGettingAdministrators ||
    isGettingInvitations;
  const isAdminInfoError = isAdministratorsError || isInvitationsError;

  const totalAdminsAndInvites = administrators.length + invitations.length;
  const isAdminLimitReached = totalAdminsAndInvites >= administratorsLimit;

  const handleInviteAdministrator = () => {
    if (isAdminLimitReached || isAdminInfoError) {
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
      {isGettingAdminInfo ? (
        <LoadingState />
      ) : (
        <>
          <AdministratorsLimit
            adminAndInviteCount={totalAdminsAndInvites}
            administratorsLimit={administratorsLimit}
            isAdminInfoError={isAdminInfoError}
          />
          <PageContent hasTable>
            <AdministratorsTabs
              administrators={administrators}
              invitationsCount={invitations.length}
            />
          </PageContent>
        </>
      )}
      {isModalOpen && (
        <Suspense fallback={<LoadingState centerOnScreen />}>
          <AdministratorLimitModal
            close={closeModal}
            isAdminInfoError={isAdminInfoError}
          />
        </Suspense>
      )}
    </PageMain>
  );
};

export default AdministratorsPage;
