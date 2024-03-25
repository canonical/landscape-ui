import { FC, lazy, Suspense } from "react";
import useDebug from "@/hooks/useDebug";
import { usePackageProfiles } from "@/features/package-profiles";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import PackageProfilesContent from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContent";

const PackageProfileAddForm = lazy(() =>
  import("@/features/package-profiles").then((module) => ({
    default: module.PackageProfileAddForm,
  })),
);

const PackageProfilesContainer: FC = () => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResult,
    error: getPackageProfilesQueryError,
    isLoading: getPackageProfilesQueryLoading,
  } = getPackageProfilesQuery();

  if (getPackageProfilesQueryError) {
    debug(getPackageProfilesQueryError);
  }

  const handleCreatePackageProfile = () => {
    setSidePanelContent(
      "Create package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileAddForm action="create" />
      </Suspense>,
      "medium",
    );
  };

  return (
    <>
      {getPackageProfilesQueryLoading && <LoadingState />}
      {!getPackageProfilesQueryLoading &&
        (!getPackageProfilesQueryResult ||
          getPackageProfilesQueryResult.data.result.length === 0) && (
          <EmptyState
            body={
              <>
                <p>You haven’t added any package profile yet.</p>
                <a
                  href="https://ubuntu.com/landscape/docs/managing-packages"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage packages in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                key="create"
                appearance="positive"
                onClick={handleCreatePackageProfile}
              >
                Create package profile
              </Button>,
            ]}
            icon="package-profiles"
            title="No package profiles found"
          />
        )}
      {!getPackageProfilesQueryLoading &&
        getPackageProfilesQueryResult &&
        getPackageProfilesQueryResult.data.result.length > 0 && (
          <PackageProfilesContent
            packageProfiles={getPackageProfilesQueryResult?.data.result}
          />
        )}
    </>
  );
};

export default PackageProfilesContainer;
