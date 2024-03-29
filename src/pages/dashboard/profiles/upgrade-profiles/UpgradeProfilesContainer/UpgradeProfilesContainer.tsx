import { FC, useState } from "react";
import useDebug from "@/hooks/useDebug";
import {
  UpgradeProfileList,
  UpgradeProfilesEmptyState,
  UpgradeProfilesHeader,
  useUpgradeProfiles,
} from "@/features/upgrade-profiles";
import LoadingState from "@/components/layout/LoadingState";

const UpgradeProfilesContainer: FC = () => {
  const [search, setSearch] = useState("");

  const debug = useDebug();
  const { getUpgradeProfilesQuery } = useUpgradeProfiles();

  const {
    data: getUpgradeProfilesResult,
    isLoading: getUpgradeProfilesLoading,
    error: getUpgradeProfilesError,
  } = getUpgradeProfilesQuery();

  if (getUpgradeProfilesError) {
    debug(getUpgradeProfilesError);
  }

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
            <UpgradeProfilesHeader
              onSearch={(searchText) => setSearch(searchText)}
            />
            <UpgradeProfileList
              profiles={getUpgradeProfilesResult.data}
              search={search}
            />
          </>
        )}
    </>
  );
};

export default UpgradeProfilesContainer;
