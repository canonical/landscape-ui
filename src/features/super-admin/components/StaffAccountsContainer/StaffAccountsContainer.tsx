import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetStaffAccounts } from "../../api";
import StaffAccountsList from "../StaffAccountsList";

const StaffAccountsContainer: FC = () => {
  const { currentPage, pageSize, search } = usePageParams();

  const {
    staffAccounts,
    staffAccountsCount,
    staffAccountsError,
    isGettingStaffAccounts,
  } = useGetStaffAccounts({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  if (staffAccountsError) {
    throw staffAccountsError;
  }

  return (
    <>
      <HeaderWithSearch />
      {isGettingStaffAccounts ? (
        <LoadingState />
      ) : (
        <StaffAccountsList staffAccounts={staffAccounts} />
      )}
      <TablePagination
        totalItems={staffAccountsCount}
        currentItemCount={staffAccounts.length}
        pageSizeLabel="Accounts per page"
      />
    </>
  );
};

export default StaffAccountsContainer;
