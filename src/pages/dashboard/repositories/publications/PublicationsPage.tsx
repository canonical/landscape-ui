import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AddPublicationButton } from "@/features/publications";
import { PublicationsContainer } from "@/features/publications";
import type { FC } from "react";

const PublicationsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader
        title="Publications"
        actions={[<AddPublicationButton key="add-publication-button" />]}
      />
      <PageContent hasTable>
        <PublicationsContainer />
      </PageContent>
    </PageMain>
  );
};

export default PublicationsPage;
