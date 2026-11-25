import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { useUsns } from "@/features/usns";
import usePageParams from "@/hooks/usePageParams";
import SecurityIssueList from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssueList";
import type { Instance } from "@/types/Instance";

interface SecurityIssuesPanelProps {
  readonly instance: Instance;
}

const SecurityIssuesPanel: FC<SecurityIssuesPanelProps> = ({ instance }) => {
  const { search, currentPage, pageSize } = usePageParams();
  const { getUsnsQuery } = useUsns();

  const {
    data: getUsnsQueryResult,
    isLoading: getUsnsQueryLoading,
    error: getUsnsQueryError,
  } = getUsnsQuery({
    computer_ids: [instance.id],
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
    show_packages: false,
  });

  if (getUsnsQueryError) {
    throw getUsnsQueryError;
  }

  const { results: usns = [], count: totalUsnCount = 0 } =
    getUsnsQueryResult?.data ?? {};

  if (!getUsnsQueryLoading && !totalUsnCount && !search) {
    return (
      <EmptyState icon="inspector-debug" title="No security issues found" />
    );
  }

  return (
    <SecurityIssueList
      instance={instance}
      isUsnsLoading={getUsnsQueryLoading}
      totalUsnCount={totalUsnCount}
      usns={usns}
    />
  );
};

export default SecurityIssuesPanel;
