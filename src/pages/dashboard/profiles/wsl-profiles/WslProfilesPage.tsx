import { FC, lazy, Suspense } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import LoadingState from "@/components/layout/LoadingState";
import {
  WslProfilesEmptyState,
  WslProfilesHeader,
  WslProfilesList,
  useWslProfiles,
} from "@/features/wsl-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";

const WslProfileInstallForm = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileInstallForm,
  })),
);

const WslProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getWslProfilesQuery } = useWslProfiles();

  const { data: getWslProfilesQueryResult, isLoading: isLoading } =
    getWslProfilesQuery();

  const handleAddWslProfile = () => {
    setSidePanelContent(
      "Add WSL profile",
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="add" />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="WSL Profiles"
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
        {isLoading && <LoadingState />}
        {!isLoading &&
          (!getWslProfilesQueryResult ||
            getWslProfilesQueryResult.data.results.length === 0) && (
            <WslProfilesEmptyState />
          )}

        {!isLoading &&
          getWslProfilesQueryResult &&
          getWslProfilesQueryResult.data.results.length > 0 && (
            <>
              <WslProfilesHeader />
              <WslProfilesList
                wslProfiles={getWslProfilesQueryResult.data.results}
              />
            </>
          )}
      </PageContent>
    </PageMain>
  );
};

export default WslProfilesPage;
