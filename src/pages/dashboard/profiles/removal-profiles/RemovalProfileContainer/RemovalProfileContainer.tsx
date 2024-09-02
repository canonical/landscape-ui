import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  RemovalProfileList,
  RemovalProfilesEmptyState,
  RemovalProfilesHeader,
  useRemovalProfiles,
} from "@/features/removal-profiles";

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
