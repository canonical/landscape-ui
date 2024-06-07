import { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useUsns from "@/hooks/useUsns";
import SecurityIssueList from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssueList";
import { usePageParams } from "@/hooks/usePageParams";
import { useParams } from "react-router-dom";

interface SecurityIssuesPanelProps {
  instanceTitle: string;
}

const SecurityIssuesPanel: FC<SecurityIssuesPanelProps> = ({
  instanceTitle,
}) => {
  const { instanceId: urlInstanceId } = useParams();
  const { search, currentPage, pageSize } = usePageParams();
  const { getUsnsQuery } = useUsns();

  const instanceId = Number(urlInstanceId);

  const { data: getUsnsQueryResult, isLoading: getUsnsQueryLoading } =
    getUsnsQuery({
      computer_ids: [instanceId],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: search,
      show_packages: false,
    });

  return (
    <>
      {!search && getUsnsQueryLoading && <LoadingState />}
      {!search &&
        !getUsnsQueryLoading &&
        (!getUsnsQueryResult ||
          getUsnsQueryResult.data.results.length === 0) && (
          <EmptyState icon="inspector-debug" title="No security issues found" />
        )}
      {(search ||
        (!getUsnsQueryLoading &&
          getUsnsQueryResult &&
          getUsnsQueryResult.data.results.length > 0)) && (
        <SecurityIssueList
          instanceTitle={instanceTitle}
          isUsnsLoading={getUsnsQueryLoading}
          totalUsnCount={getUsnsQueryResult?.data.count ?? 0}
          usns={getUsnsQueryResult?.data.results ?? []}
        />
      )}
    </>
  );
};

export default SecurityIssuesPanel;
