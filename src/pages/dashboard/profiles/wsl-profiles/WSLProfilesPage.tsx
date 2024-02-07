import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

const WSLProfilesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="WSL Profiles" />
      <PageContent>
        <div>WSL Profiles</div>
      </PageContent>
    </PageMain>
  );
};

export default WSLProfilesPage;
