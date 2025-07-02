import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { useUsns } from "@/features/usns";
import usePageParams from "@/hooks/usePageParams";
import SecurityIssueList from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssueList";
import type { Instance } from "@/types/Instance";
import {
  isSecurityEmptyState,
  isSecurityListLoaded,
  isSecurityLoadingState,
} from "./helpers";

interface SecurityIssuesPanelProps {
  readonly instance: Instance;
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
      {isSecurityLoadingState({
        search,
        currentPage,
        pageSize,
        getUsnsQueryLoading,
      }) && <LoadingState />}
      {isSecurityEmptyState({
        search,
        currentPage,
        pageSize,
        getUsnsQueryLoading,
        getUsnsQueryResult,
      }) && (
        <EmptyState icon="inspector-debug" title="No security issues found" />
      )}
      {isSecurityListLoaded({
        currentPage,
        getUsnsQueryLoading,
        getUsnsQueryResult,
        pageSize,
        search,
      }) && (
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
