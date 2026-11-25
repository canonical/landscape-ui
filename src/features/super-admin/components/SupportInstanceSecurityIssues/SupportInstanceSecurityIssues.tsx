import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetStaffUsns } from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceUsnList from "./SupportInstanceUsnList";

/** The Security issues tab of an instance in a support session. */
const SupportInstanceSecurityIssues: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const { search, currentPage, pageSize } = usePageParams();

  const { staffUsns, staffUsnsCount, staffUsnsError, isGettingStaffUsns } =
    useGetStaffUsns(name, {
      computer_ids: [instance.id],
      limit: pageSize,
      offset: currentPage * pageSize - pageSize,
      search,
      show_packages: false,
    });

  if (staffUsnsError) {
    throw staffUsnsError;
  }

  if (!isGettingStaffUsns && !(staffUsnsCount || search)) {
    return (
      <EmptyState icon="inspector-debug" title="No security issues found" />
    );
  }

  return (
    <>
      <HeaderWithSearch />
      {isGettingStaffUsns ? (
        <LoadingState />
      ) : (
        <>
          <SupportInstanceUsnList
            name={name}
            instance={instance}
            usns={staffUsns}
            search={search}
          />
          <TablePagination
            totalItems={staffUsnsCount}
            currentItemCount={staffUsns.length}
          />
        </>
      )}
    </>
  );
};

export default SupportInstanceSecurityIssues;
