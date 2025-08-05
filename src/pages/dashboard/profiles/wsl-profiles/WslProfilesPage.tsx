import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { useGetWslLimits } from "@/features/wsl";
import {
  useGetWslProfiles,
  WslProfileInstallForm,
  WslProfilesEmptyState,
  WslProfilesHeader,
  WslProfilesList,
} from "@/features/wsl-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";

const WslProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const {
    isGettingWslProfiles: isGettingUnfilteredWslProfiles,
    wslProfilesCount: unfilteredWslProfilesCount,
  } = useGetWslProfiles(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    },
    { listenToUrlParams: false },
  );

  const { isGettingWslLimits, wslProfileLimit } = useGetWslLimits();

  const handleAddWslProfile = () => {
    setSidePanelContent("Add WSL profile", <WslProfileInstallForm />);
  };

  const isWslProfileLimitReached =
    unfilteredWslProfilesCount >= wslProfileLimit;

  return (
    <PageMain>
      {isGettingUnfilteredWslProfiles ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title="WSL profiles"
            actions={[
              <Button
                type="button"
                key="add-wsl-profile"
                appearance="positive"
                onClick={handleAddWslProfile}
                disabled={isWslProfileLimitReached}
              >
                Add WSL profile
              </Button>,
            ]}
          />

          <PageContent>
            {!unfilteredWslProfilesCount ? (
              <WslProfilesEmptyState />
            ) : isGettingWslLimits ? (
              <LoadingState />
            ) : (
              <>
                <WslProfilesHeader />

                {isWslProfileLimitReached && (
                  <Notification
                    severity="caution"
                    inline
                    title="Profile limit reached:"
                  >
                    You&apos;ve reached the limit of {wslProfileLimit} active
                    WSL profiles. You must remove a profile to be able to add a
                    new one.
                  </Notification>
                )}

                <WslProfilesList />
              </>
            )}
          </PageContent>
        </>
      )}
    </PageMain>
  );
};

export default WslProfilesPage;
