import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { useGetWslLimits } from "@/features/wsl";
import {
  useGetWslProfiles,
  WslProfilesEmptyState,
  WslProfilesHeader,
  WslProfilesList,
} from "@/features/wsl-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { Button, Notification } from "@canonical/react-components";
import { lazy, type FC } from "react";

const WslProfileAddSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileAddSidePanel,
  })),
);

const WslProfileDetailsSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileDetailsSidePanel,
  })),
);

const WslProfileEditSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileEditSidePanel,
  })),
);

const WslProfileNonCompliantInstancesSidePanel = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileNonCompliantInstancesSidePanel,
  })),
);

const WslProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", [
    "add",
    "edit",
    "noncompliant",
    "view",
    "view/edit",
  ]);

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
    setPageParams({ action: "add", wslProfile: "" });
  };

  const isWslProfileLimitReached =
    unfilteredWslProfilesCount >= wslProfileLimit;

  const closeSidePanel = () => {
    setPageParams({ action: "", wslProfile: "" });
  };

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

      <SidePanel
        onClose={closeSidePanel}
        isOpen={!!action}
        size={action === "noncompliant" ? "large" : undefined}
      >
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <WslProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <WslProfileEditSidePanel hasBackButton={action === "view/edit"} />
          </SidePanel.Suspense>
        )}

        {action === "noncompliant" && (
          <SidePanel.Suspense key="noncompliant">
            <WslProfileNonCompliantInstancesSidePanel />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <WslProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default WslProfilesPage;
