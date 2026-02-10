import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useUpgradeProfiles } from "../../hooks";
import UpgradeProfilesEmptyState from "../UpgradeProfilesEmptyState";
import UpgradeProfilesHeader from "../UpgradeProfilesHeader";
import UpgradeProfileList from "../UpgradeProfileList";

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
