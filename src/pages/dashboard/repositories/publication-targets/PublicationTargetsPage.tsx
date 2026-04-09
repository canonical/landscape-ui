import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  PublicationTargetAddButton,
  PublicationTargetContainer,
  usePublicationTargets,
} from "@/features/publication-targets";
import type { Publication, PublicationTargetWithPublications } from "@/features/publication-targets";
import type { FC } from "react";

const PublicationTargetsPage: FC = () => {
  const { getPublicationTargetsQuery } = usePublicationTargets();
  const publicationTargetsResult = getPublicationTargetsQuery();

  if (publicationTargetsResult.isPending) {
    return <LoadingState />;
  }

  const targets: PublicationTargetWithPublications[] = (
    publicationTargetsResult.data?.data.publication_targets ?? []
  ).map((target) => ({
    ...target,
    publications: (target.publications as Publication[] | undefined) ?? [],
  }));

  return (
    <PageMain>
      <PageHeader
        title="Publication targets"
        actions={
          targets.length > 0
            ? [<PublicationTargetAddButton key="add" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <PublicationTargetContainer targets={targets} />
      </PageContent>
    </PageMain>
  );
};

export default PublicationTargetsPage;
