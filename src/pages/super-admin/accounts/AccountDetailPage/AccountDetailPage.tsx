import type { FC } from "react";
import { useParams } from "react-router";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";

// The detail sections land with LNDENG-5097, 5098 and 5099.
const AccountDetailPage: FC = () => {
  const { name = "" } = useParams<{ name: string }>();

  return (
    <PageMain>
      <PageHeader title={name} />
      <PageContent>
        <p className="u-text--muted">
          Overview, feature flags, limits and WSL limits of this account.
        </p>
      </PageContent>
    </PageMain>
  );
};

export default AccountDetailPage;
