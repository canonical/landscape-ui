import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import PackageProfilesEmptyState from "../PackageProfilesEmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfilesContent from "../PackageProfilesContent";

const PackageProfilesContainer: FC = () => {
  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResult,
    isLoading: getPackageProfilesQueryLoading,
  } = getPackageProfilesQuery();

  return (
    <>
      {getPackageProfilesQueryLoading && <LoadingState />}
      {!getPackageProfilesQueryLoading &&
        (!getPackageProfilesQueryResult ||
          getPackageProfilesQueryResult.data.result.length === 0) && (
          <PackageProfilesEmptyState />
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
