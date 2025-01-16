import { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { useUsns } from "@/features/usns";
import usePageParams from "@/hooks/usePageParams";
import SecurityIssueList from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssueList";
import { Instance } from "@/types/Instance";

interface SecurityIssuesPanelProps {
  instance: Instance;
}

const SecurityIssuesPanel: FC<SecurityIssuesPanelProps> = ({ instance }) => {
  const { search, currentPage, pageSize } = usePageParams();
  const { getUsnsQuery } = useUsns();

  const { data: getUsnsQueryResult, isLoading: getUsnsQueryLoading } =
    getUsnsQuery({
      computer_ids: [instance.id],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: search,
      show_packages: false,
    });

  return (
    <>
      {!search &&
        currentPage === 1 &&
        pageSize === 20 &&
        getUsnsQueryLoading && <LoadingState />}
      {!search &&
        currentPage === 1 &&
        pageSize === 20 &&
        !getUsnsQueryLoading &&
        (!getUsnsQueryResult ||
          getUsnsQueryResult.data.results.length === 0) && (
          <EmptyState icon="inspector-debug" title="No security issues found" />
        )}
      {(search ||
        currentPage > 1 ||
        pageSize !== 20 ||
        (!getUsnsQueryLoading &&
          getUsnsQueryResult &&
          getUsnsQueryResult.data.results.length > 0)) && (
        <SecurityIssueList
          instance={instance}
          isUsnsLoading={getUsnsQueryLoading}
          totalUsnCount={getUsnsQueryResult?.data.count ?? 0}
          usns={getUsnsQueryResult?.data.results ?? []}
        />
      )}
    </>
  );
};

export default SecurityIssuesPanel;
