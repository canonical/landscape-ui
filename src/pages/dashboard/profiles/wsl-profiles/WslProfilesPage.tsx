import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { useGetWslLimits } from "@/features/wsl";
import {
  useGetWslProfiles,
  WslProfileAddButton,
  WslProfilesEmptyState,
  WslProfilesHeader,
  WslProfilesList,
} from "@/features/wsl-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { Notification } from "@canonical/react-components";
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
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

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
              <WslProfileAddButton
                key="add-wsl-profile"
                disabled={isWslProfileLimitReached}
              />,
            ]}
          />

          <PageContent hasTable>
            {!unfilteredWslProfilesCount ? (
              <WslProfilesEmptyState />
            ) : isGettingWslLimits ? (
              <LoadingState />
            ) : (
              <>
                <Notification
                  severity="caution"
                  title="WSL profiles is a beta feature"
                >
                  We are gathering feedback to improve this feature.{" "}
                  <a
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    href="https://discourse.ubuntu.com/t/feedback-on-the-new-web-portal/50528"
                  >
                    Share your feedback
                  </a>
                </Notification>

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
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        isOpen={!!sidePath.length}
        size={lastSidePathSegment === "noncompliant" ? "large" : undefined}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <WslProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <WslProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "noncompliant" && (
          <SidePanel.Suspense key="noncompliant">
            <WslProfileNonCompliantInstancesSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <WslProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default WslProfilesPage;
