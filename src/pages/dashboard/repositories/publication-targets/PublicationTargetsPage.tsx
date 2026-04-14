import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  PublicationTargetAddButton,
  PublicationTargetContainer,
} from "@/features/publication-targets";
import type { FC } from "react";

const PublicationTargetsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader
        title="Publication targets"
        actions={[<PublicationTargetAddButton key="add" />]}
      />
      <PageContent hasTable>
        <PublicationTargetContainer />
      </PageContent>
    </PageMain>
  );
};

export default PublicationTargetsPage;
