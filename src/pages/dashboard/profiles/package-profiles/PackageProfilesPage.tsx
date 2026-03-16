import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ProfilesProvider } from "@/context/profiles";
import { usePackageProfiles } from "@/features/package-profiles";
import type { FC } from "react";
import { AddProfileButton, ProfilesContainer } from "@/features/profiles";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy } from "react";
import { ProfileTypes } from "@/features/profiles";

const PackageProfileAddSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileAddSidePanel,
  })),
);

const PackageProfileConstraintsAddSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsAddSidePanel,
  })),
);

const PackageProfileConstraintsEditSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileConstraintsEditSidePanel,
  })),
);

const PackageProfileDuplicateSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileDuplicateSidePanel,
  })),
);

const PackageProfileEditSidePanel = lazy(async () =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileEditSidePanel,
  })),
);

const PackageProfilesPage: FC = () => {
  const { getPackageProfilesQuery } = usePackageProfiles();
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "add-constraints",
    "duplicate",
    "edit",
    "edit-constraints",
  ]);
  
  const {
    data: getPackageProfilesQueryResult,
    isPending: isGettingPackageProfiles,
  } = getPackageProfilesQuery();
  const packageProfiles = getPackageProfilesQueryResult?.data.result ?? [];

  return (
    <ProfilesProvider>
      <PageMain>
        <PageHeader
          title="Package profiles"
          actions={packageProfiles.length
            ? [<AddProfileButton type={ProfileTypes.package} key="add-package-profile" />]
            : undefined
          }
        />
        <PageContent hasTable>
          <ProfilesContainer
            type={ProfileTypes.package}
            profiles={packageProfiles}
            isPending={isGettingPackageProfiles}
          />
        </PageContent>
        
        <SidePanel
          onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
          isOpen={!!sidePath.length}
          size={
            lastSidePathSegment === "add" ||
            lastSidePathSegment === "add-constraints" ||
            lastSidePathSegment === "edit-constraints"
              ? "medium"
              : undefined
          }
        >
          {lastSidePathSegment === "add" && (
            <SidePanel.Suspense key="add">
              <PackageProfileAddSidePanel />
            </SidePanel.Suspense>
          )}

          {lastSidePathSegment === "add-constraints" && (
            <SidePanel.Suspense key="add-constraints">
              <PackageProfileConstraintsAddSidePanel />
            </SidePanel.Suspense>
          )}

          {lastSidePathSegment === "duplicate" && (
            <SidePanel.Suspense key="duplicate">
              <PackageProfileDuplicateSidePanel />
            </SidePanel.Suspense>
          )}

          {lastSidePathSegment === "edit" && (
            <SidePanel.Suspense key="edit">
              <PackageProfileEditSidePanel />
            </SidePanel.Suspense>
          )}

          {lastSidePathSegment === "edit-constraints" && (
            <SidePanel.Suspense key="edit-constraints">
              <PackageProfileConstraintsEditSidePanel />
            </SidePanel.Suspense>
          )}
        </SidePanel>
      </PageMain>
    </ProfilesProvider>
  );
};

export default PackageProfilesPage;
