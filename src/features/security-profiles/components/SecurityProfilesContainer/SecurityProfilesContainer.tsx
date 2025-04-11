import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import SecurityProfilesEmptyState from "../SecurityProfilesEmptyState";
import SecurityProfilesHeader from "../SecurityProfilesHeader";
import SecurityProfilesList from "../SecurityProfilesList";
import LoadingState from "@/components/layout/LoadingState";
import { useGetSecurityProfiles } from "../../api/useGetSecurityProfiles";

const SecurityProfilesContainer: FC = () => {
  const { currentPage, pageSize, search, statuses } = usePageParams();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      statuses: statuses.length === 0 ? [] : statuses,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  if (isSecurityProfilesLoading) {
    return <LoadingState />;
  }

  if (!securityProfiles.length && !search) {
    return <SecurityProfilesEmptyState />;
  }

  return (
    <>
      <SecurityProfilesHeader />
      <SecurityProfilesList securityProfiles={securityProfiles} />
    </>
  );
};

export default SecurityProfilesContainer;
