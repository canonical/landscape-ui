import { FC } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import Activities from "../../../components/activities";

const ActivitiesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Activities" />
      <PageContent>
        <Activities />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
