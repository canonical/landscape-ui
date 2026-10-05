import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { StaffAccountsContainer } from "@/features/super-admin";

const AccountsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Accounts" />
      <PageContent hasTable>
        <StaffAccountsContainer />
      </PageContent>
    </PageMain>
  );
};

export default AccountsPage;
