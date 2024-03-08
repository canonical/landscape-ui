import { FC, useState } from "react";
import { Usn } from "@/types/Usn";
import TablePagination from "@/components/layout/TablePagination";
import SecurityIssuesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssuesPanelHeader";
import { UsnList } from "@/features/usns";
import { Instance } from "@/types/Instance";

interface SecurityIssueListProps {
  currentPage: number;
  instance: Instance;
  isUsnsLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearch: (searchText: string) => void;
  pageSize: number;
  search: string;
  totalUsnCount: number;
  usns: Usn[];
}

const SecurityIssueList: FC<SecurityIssueListProps> = ({
  currentPage,
  instance,
  isUsnsLoading,
  onPageChange,
  onPageSizeChange,
  onSearch,
  pageSize,
  search,
  totalUsnCount,
  usns,
}) => {
  const [selectedUsns, setSelectedUsns] = useState<Usn[]>([]);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setSelectedUsns([]);
  };

  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange(pageSize);
    setSelectedUsns([]);
  };

  const handleSearch = (searchText: string) => {
    handlePageChange(1);
    onSearch(searchText);
  };

  return (
    <>
      <SecurityIssuesPanelHeader
        onSearch={handleSearch}
        instance={instance}
        usns={selectedUsns.map(({ usn }) => usn)}
      />
      <UsnList
        tableType="paginated"
        instance={instance}
        isUsnsLoading={isUsnsLoading}
        onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
        search={search}
        selectedUsns={selectedUsns}
        usns={usns}
      />
      {usns.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          paginate={handlePageChange}
          setPageSize={handlePageSizeChange}
          totalItems={totalUsnCount}
          currentItemCount={usns.length}
        />
      )}
    </>
  );
};

export default SecurityIssueList;
