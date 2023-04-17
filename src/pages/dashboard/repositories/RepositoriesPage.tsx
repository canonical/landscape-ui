import { FC } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";

const RepositoriesPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Repository Mirrors" />
      <PageContent>Repository Mirrors</PageContent>
    </PageMain>
  );
};

export default RepositoriesPage;
