import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";

// The search lands with LNDENG-5158.
const PeoplePage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="People" />
      <PageContent>
        <p className="u-text--muted">
          Users and pending invitations across every account.
        </p>
      </PageContent>
    </PageMain>
  );
};

export default PeoplePage;
