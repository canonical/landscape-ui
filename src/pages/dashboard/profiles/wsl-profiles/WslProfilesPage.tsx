import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  useGetWslProfiles,
  WslProfileInstallForm,
  WslProfilesEmptyState,
  WslProfilesHeader,
  WslProfilesList,
} from "@/features/wsl-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { Button } from "@canonical/react-components";
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

  const handleAddWslProfile = () => {
    setSidePanelContent(
      "Add WSL profile",
      <WslProfileInstallForm action="add" />,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="WSL profiles"
        actions={[
          <Button
            type="button"
            key="add-wsl-profile"
            appearance="positive"
            onClick={handleAddWslProfile}
          >
            Add WSL profile
          </Button>,
        ]}
      />

      <PageContent>
        {isGettingUnfilteredWslProfiles ? (
          <LoadingState />
        ) : !unfilteredWslProfilesCount ? (
          <WslProfilesEmptyState />
        ) : (
          <>
            <WslProfilesHeader />
            <WslProfilesList />
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default WslProfilesPage;
