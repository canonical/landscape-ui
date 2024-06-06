import { FC, useState } from "react";
import { Usn } from "@/types/Usn";
import { TablePagination } from "@/components/layout/TablePagination";
import SecurityIssuesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssuesPanelHeader";
import { UsnList } from "@/features/usns";
import { usePageParams } from "@/hooks/usePageParams";

interface SecurityIssueListProps {
  instanceTitle: string;
  isUsnsLoading: boolean;
  totalUsnCount: number;
  usns: Usn[];
}

const SecurityIssueList: FC<SecurityIssueListProps> = ({
  instanceTitle,
  isUsnsLoading,
  totalUsnCount,
  usns,
}) => {
  const [selectedUsns, setSelectedUsns] = useState<Usn[]>([]);

  const { search, setPageParams } = usePageParams();

  const handleClearSelection = () => {
    setSelectedUsns([]);
  };

  const handleSearch = (searchText: string) => {
    setPageParams({
      search: searchText,
    });
    handleClearSelection();
  };

  return (
    <>
      <SecurityIssuesPanelHeader
        onSearch={handleSearch}
        usns={selectedUsns.map(({ usn }) => usn)}
      />
      <UsnList
        tableType="paginated"
        instanceTitle={instanceTitle}
        isUsnsLoading={isUsnsLoading}
        onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
        search={search}
        selectedUsns={selectedUsns}
        usns={usns}
      />
      {usns.length > 0 && (
        <TablePagination
          handleClearSelection={handleClearSelection}
          totalItems={totalUsnCount}
          currentItemCount={usns.length}
        />
      )}
    </>
  );
};

export default SecurityIssueList;
