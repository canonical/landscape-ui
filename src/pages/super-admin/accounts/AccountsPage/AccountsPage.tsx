import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";

// The list itself lands with LNDENG-5096.
const AccountsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Accounts" />
      <PageContent>
        <p className="u-text--muted">Every account in this deployment.</p>
      </PageContent>
    </PageMain>
  );
};

export default AccountsPage;
