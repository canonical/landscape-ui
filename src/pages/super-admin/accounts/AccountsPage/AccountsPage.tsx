import type { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { TablePagination } from "@/components/layout/TablePagination";
import { StaffAccountsList, useGetStaffAccounts } from "@/features/super-admin";
import usePageParams from "@/hooks/usePageParams";

const AccountsPage: FC = () => {
  const { currentPage, pageSize, search } = usePageParams();

  const { staffAccounts, staffAccountsCount, isGettingStaffAccounts } =
    useGetStaffAccounts({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search,
    });

  return (
    <PageMain>
      <PageHeader title="Accounts" />
      <PageContent>
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
      </PageContent>
    </PageMain>
  );
};

export default AccountsPage;
