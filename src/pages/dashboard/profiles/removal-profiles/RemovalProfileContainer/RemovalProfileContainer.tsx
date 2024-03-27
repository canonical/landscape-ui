import { FC, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  RemovalProfileList,
  RemovalProfilesEmptyState,
  RemovalProfilesHeader,
  useRemovalProfiles,
} from "@/features/removal-profiles";
import useDebug from "@/hooks/useDebug";

const RemovalProfileContainer: FC = () => {
  const [search, setSearch] = useState("");

  const debug = useDebug();
  const { getRemovalProfilesQuery } = useRemovalProfiles();

  const {
    data: getRemovalProfilesQueryResult,
    error: getRemovalProfilesQueryError,
    isLoading: getRemovalProfilesQueryLoading,
  } = getRemovalProfilesQuery();

  if (getRemovalProfilesQueryError) {
    debug(getRemovalProfilesQueryError);
  }

  return (
    <>
      {getRemovalProfilesQueryLoading && <LoadingState />}
      {!getRemovalProfilesQueryLoading &&
        (!getRemovalProfilesQueryResult ||
          getRemovalProfilesQueryResult.data.length === 0) && (
          <RemovalProfilesEmptyState />
        )}
      {!getRemovalProfilesQueryLoading &&
        getRemovalProfilesQueryResult &&
        getRemovalProfilesQueryResult.data.length > 0 && (
          <>
            <RemovalProfilesHeader
              onSearch={(searchText) => setSearch(searchText)}
            />
            <RemovalProfileList
              profiles={getRemovalProfilesQueryResult.data}
              search={search}
            />
          </>
        )}
    </>
  );
};

export default RemovalProfileContainer;
