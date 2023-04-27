import { FC } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";

const DistributionProfilesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Repository Profiles" />
      <PageContent>Repository Profiles</PageContent>
    </PageMain>
  );
};

export default DistributionProfilesPage;
