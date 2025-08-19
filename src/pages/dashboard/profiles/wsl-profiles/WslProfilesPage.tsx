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

const WslProfileInstallForm = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileInstallForm,
  })),
);

const WslProfileDetails = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileDetails,
  })),
);

const WslProfileEditForm = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileEditForm,
  })),
);

const WslProfileNonCompliantInstancesList = lazy(() =>
  import("@/features/wsl-profiles").then((module) => ({
    default: module.WslProfileNonCompliantInstancesList,
  })),
);

const WslProfilesPage: FC = () => {
  const { sidePath, lastSidePathSegment, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "edit",
    "noncompliant",
    "view",
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
    setPageParams({ sidePath: ["add"], wslProfile: "" });
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

      <SidePanel
        onClose={() => {
          setPageParams({ sidePath: [], wslProfile: "" });
        }}
        isOpen={!!sidePath.length}
        size={lastSidePathSegment === "noncompliant" ? "large" : undefined}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <WslProfileInstallForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <WslProfileEditForm />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "noncompliant" && (
          <SidePanel.Suspense key="noncompliant">
            <WslProfileNonCompliantInstancesList />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <WslProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default WslProfilesPage;
