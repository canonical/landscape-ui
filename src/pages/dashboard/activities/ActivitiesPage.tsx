import { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import Activities from "@/features/activities";

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
