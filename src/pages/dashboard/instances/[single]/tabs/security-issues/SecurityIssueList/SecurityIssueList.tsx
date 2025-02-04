import type { FC } from "react";
import { useState } from "react";
import type { Usn } from "@/types/Usn";
import SecurityIssuesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/security-issues/SecurityIssuesPanelHeader";
import { UsnList } from "@/features/usns";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";

interface SecurityIssueListProps {
  readonly instance: Instance;
  readonly isUsnsLoading: boolean;
  readonly totalUsnCount: number;
  readonly usns: Usn[];
}

const SecurityIssueList: FC<SecurityIssueListProps> = ({
  instance,
  isUsnsLoading,
  totalUsnCount,
  usns,
}) => {
  const [selectedUsns, setSelectedUsns] = useState<string[]>([]);

  const { search } = usePageParams();
  return (
    <>
      <SecurityIssuesPanelHeader usns={selectedUsns} />
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
