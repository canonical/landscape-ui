import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import {
  PackageProfilesEmptyState,
  usePackageProfiles,
} from "@/features/package-profiles";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfilesContent from "@/pages/dashboard/profiles/package-profiles/PackageProfilesContent";

const PackageProfilesContainer: FC = () => {
  const debug = useDebug();
  const { getPackageProfilesQuery } = usePackageProfiles();

  const {
    data: getPackageProfilesQueryResult,
    error: getPackageProfilesQueryError,
    isLoading: getPackageProfilesQueryLoading,
  } = getPackageProfilesQuery();

  if (getPackageProfilesQueryError) {
    debug(getPackageProfilesQueryError);
  }

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
