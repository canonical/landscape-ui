import { FC, useState } from "react";
import { Usn } from "@/types/Usn";
import SecurityIssuesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssuesPanelHeader";
import { UsnList } from "@/features/usns";
import usePageParams from "@/hooks/usePageParams";
import { Instance } from "@/types/Instance";

interface SecurityIssueListProps {
  instance: Instance;
  isUsnsLoading: boolean;
  totalUsnCount: number;
  usns: Usn[];
}

const SecurityIssueList: FC<SecurityIssueListProps> = ({
  instance,
  isUsnsLoading,
  totalUsnCount,
  usns,
}) => {
  const [selectedUsns, setSelectedUsns] = useState<string[]>([]);

  const { search, setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({
      search: searchText,
    });
    setSelectedUsns([]);
  };

  return (
    <>
      <SecurityIssuesPanelHeader onSearch={handleSearch} usns={selectedUsns} />
      <UsnList
        tableType="paginated"
        instances={[instance]}
        isUsnsLoading={isUsnsLoading}
        onSelectedUsnsChange={(usns) => setSelectedUsns(usns)}
        search={search}
        selectedUsns={selectedUsns}
        totalUsnCount={totalUsnCount}
        usns={usns}
      />
    </>
  );
};

export default SecurityIssueList;
