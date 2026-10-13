import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { StaffPeopleContainer } from "@/features/super-admin";

const PeoplePage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="People" />
      <PageContent hasTable>
        <StaffPeopleContainer />
      </PageContent>
    </PageMain>
  );
};

export default PeoplePage;
