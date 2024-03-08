import { FC, useState } from "react";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useUsns from "@/hooks/useUsns";
import SecurityIssueList from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssueList";
import { Instance } from "@/types/Instance";

interface SecurityIssuesPanelProps {
  instance: Instance;
}

const SecurityIssuesPanel: FC<SecurityIssuesPanelProps> = ({ instance }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const debug = useDebug();
  const { getUsnsQuery } = useUsns();

  const {
    data: getUsnsQueryResult,
    isLoading: getUsnsQueryLoading,
    error: getUsnsQueryError,
  } = getUsnsQuery(
    {
      computer_ids: [instance.id],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: search,
      show_packages: false,
    },
    { enabled: !!instance },
  );

  if (getUsnsQueryError) {
    debug(getUsnsQueryError);
  }

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
          currentPage={currentPage}
          instance={instance}
          isUsnsLoading={getUsnsQueryLoading}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onSearch={(searchText) => setSearch(searchText)}
          pageSize={pageSize}
          search={search}
          totalUsnCount={getUsnsQueryResult?.data.count ?? 0}
          usns={getUsnsQueryResult?.data.results ?? []}
        />
      )}
    </>
  );
};

export default SecurityIssuesPanel;
