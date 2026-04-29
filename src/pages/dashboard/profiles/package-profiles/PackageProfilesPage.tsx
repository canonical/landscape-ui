import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  usePackageProfiles,
  useGetPagePackageProfile,
} from "@/features/package-profiles";
import type { FC } from "react";
import {
  AddProfileButton,
  ProfilesContainer,
  ViewProfileSidePanel,
} from "@/features/profiles";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { lazy, useEffect } from "react";
import { ProfileTypes } from "@/features/profiles";
import useProfiles from "@/hooks/useProfiles";

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

  const { packageProfile } = useGetPagePackageProfile();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "add-constraints",
    "duplicate",
    "edit",
    "edit-constraints",
    "view",
  ]);

  const {
    data: getPackageProfilesQueryResult,
    isPending: isGettingPackageProfiles,
  } = getPackageProfilesQuery();
  const packageProfiles = getPackageProfilesQueryResult?.data.result ?? [];

  const { removePackageProfileQuery } = usePackageProfiles();
  const { setRemoveProfile, setIsRemovingProfile } = useProfiles();

  useEffect(() => {
    setRemoveProfile(({ name }) =>
      removePackageProfileQuery.mutateAsync({ name }),
    );
    setIsRemovingProfile(removePackageProfileQuery.isPending);
  }, [setRemoveProfile, removePackageProfileQuery, setIsRemovingProfile]);

  return (
    <PageMain>
      <PageHeader
        title="Package profiles"
        actions={
          packageProfiles.length
            ? [<AddProfileButton key="add-package-profile" />]
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
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
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

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.package}
              profile={packageProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default PackageProfilesPage;
