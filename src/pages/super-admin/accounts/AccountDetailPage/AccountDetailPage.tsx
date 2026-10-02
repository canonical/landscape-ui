import type { FC } from "react";
import { useParams } from "react-router";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { StaffAccountContainer } from "@/features/super-admin";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";

const TABLE_TABS = ["administrators", "licenses", "feature-flags"];

// The limits and WSL limits tabs land with LNDENG-5098 and 5099.
const AccountDetailPage: FC = () => {
  const { name = "" } = useParams<{ name: string }>();
  const { tab } = usePageParams();

  return (
    <PageMain>
      <PageHeader
        title={name}
        hideTitle
        breadcrumbs={[
          { label: "Accounts", path: ROUTES.superAdmin.accounts() },
          { label: name, current: true },
        ]}
      />
      <PageContent hasTable={TABLE_TABS.includes(tab)}>
        <StaffAccountContainer name={name} />
      </PageContent>
    </PageMain>
  );
};

export default AccountDetailPage;
