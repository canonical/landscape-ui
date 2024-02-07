import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

const ReportsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Reports" />
      <PageContent>
        <div>Reports</div>
      </PageContent>
    </PageMain>
  );
};

export default ReportsPage;
