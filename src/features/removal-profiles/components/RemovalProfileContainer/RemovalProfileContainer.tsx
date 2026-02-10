import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { useRemovalProfiles } from "../../hooks";
import RemovalProfilesEmptyState from "../RemovalProfilesEmptyState";
import RemovalProfilesHeader from "../RemovalProfilesHeader";
import RemovalProfileList from "../RemovalProfileList";

const RemovalProfileContainer: FC = () => {
  const { getRemovalProfilesQuery } = useRemovalProfiles();

  const {
    data: getRemovalProfilesQueryResult,
    isLoading: getRemovalProfilesQueryLoading,
  } = getRemovalProfilesQuery();

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
            <RemovalProfilesHeader />
            <RemovalProfileList profiles={getRemovalProfilesQueryResult.data} />
          </>
        )}
    </>
  );
};

export default RemovalProfileContainer;
