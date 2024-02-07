import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

interface RemovalProfilesPageProps {}

const RemovalProfilesPage: FC<RemovalProfilesPageProps> = () => {
  return (
    <PageMain>
      <PageHeader title="Removal profiles" />
      <PageContent>
        <div>Removal profiles</div>
      </PageContent>
    </PageMain>
  );
};

export default RemovalProfilesPage;
