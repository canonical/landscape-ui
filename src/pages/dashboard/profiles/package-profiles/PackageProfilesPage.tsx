import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

const PackageProfilesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Package profiles" />
      <PageContent>
        <div>Package profiles</div>
      </PageContent>
    </PageMain>
  );
};

export default PackageProfilesPage;
