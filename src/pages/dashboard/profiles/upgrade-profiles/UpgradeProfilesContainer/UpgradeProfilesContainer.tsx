import { FC } from "react";
import {
  UpgradeProfileList,
  UpgradeProfilesEmptyState,
  UpgradeProfilesHeader,
  useUpgradeProfiles,
} from "@/features/upgrade-profiles";
import LoadingState from "@/components/layout/LoadingState";

const UpgradeProfilesContainer: FC = () => {
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();

  const {
    data: getUpgradeProfilesResult,
    isLoading: getUpgradeProfilesLoading,
  } = getUpgradeProfilesQuery();

  return (
    <>
      {getUpgradeProfilesLoading && <LoadingState />}
      {!getUpgradeProfilesLoading &&
        (!getUpgradeProfilesResult ||
          !getUpgradeProfilesResult.data.length) && (
          <UpgradeProfilesEmptyState />
        )}
      {!getUpgradeProfilesLoading &&
        getUpgradeProfilesResult &&
        getUpgradeProfilesResult.data.length > 0 && (
          <>
            <UpgradeProfilesHeader />
            <UpgradeProfileList profiles={getUpgradeProfilesResult.data} />
          </>
        )}
    </>
  );
};

export default UpgradeProfilesContainer;
