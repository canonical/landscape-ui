import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

const AdministratorsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Administrators" />
      <PageContent>
        <div>Administrators</div>
      </PageContent>
    </PageMain>
  );
};

export default AdministratorsPage;
