import PublicationsList from "../PublicationsList";
import NoPublicationTargetEmptyState from "../NoPublicationsTargetEmptyState/NoPublicationTargetEmptyState";
import NoPublicationsEmptyState from "../NoPublicationsEmptyState/NoPublicationsEmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import PublicationsHeader from "../PublicationsHeader";
import { useGetPublicationTargets } from "@/features/publication-targets";
import { useMemo } from "react";
import { useBatchGetPublicationTargets, useGetPublications } from "../../api";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import AddPublicationButton from "../AddPublicationButton";
import { useBatchGetLocals } from "@/features/local-repositories";
import { useBatchGetMirrors } from "@/features/mirrors";

const PublicationsContainer = () => {
  const { query } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets({ pageSize: 1 });
  const { publications, publicationsCount, isGettingPublications } =
    useGetPublications();

  const publicationTargetNames = useMemo(
    () => [...new Set(publications.map((p) => p.publicationTarget))],
    [publications],
  );

  const mirrorNames = useMemo(
    () => [
      ...new Set(
        publications
          .map((p) => p.source)
          .filter((s) => s.startsWith("mirrors/")),
      ),
    ],
    [publications],
  );

  const localNames = useMemo(
    () => [
      ...new Set(
        publications
          .map((p) => p.source)
          .filter((s) => s.startsWith("locals/")),
      ),
    ],
    [publications],
  );

  const {
    publicationTargetDisplayNames,
    isLoadingPublicationTargetDisplayNames,
  } = useBatchGetPublicationTargets(publicationTargetNames);
  const { mirrorDisplayNames, isLoadingMirrorDisplayNames } =
    useBatchGetMirrors(mirrorNames);
  const { localDisplayNames, isLoadingLocalDisplayNames } =
    useBatchGetLocals(localNames);

  const sourceDisplayNames = useMemo(
    () => ({ ...mirrorDisplayNames, ...localDisplayNames }),
    [mirrorDisplayNames, localDisplayNames],
  );

  const isLoadingDisplayNames =
    isLoadingPublicationTargetDisplayNames ||
    isLoadingMirrorDisplayNames ||
    isLoadingLocalDisplayNames;

  const isMissingTargets = !publicationTargets?.length;
  const isMissingPublications = !publicationsCount && !query;

  const getContent = () => {
    if (isGettingPublicationTargets) {
      return <LoadingState />;
    }

    if (isMissingTargets) {
      return <NoPublicationTargetEmptyState />;
    }

    if (isMissingPublications && !isGettingPublications) {
      return <NoPublicationsEmptyState />;
    }

    return (
      <>
        <PublicationsHeader />
        {isGettingPublications || isLoadingDisplayNames ? (
          <LoadingState />
        ) : (
          <>
            <PublicationsList
              publications={publications}
              sourceDisplayNames={sourceDisplayNames}
              publicationTargetDisplayNames={publicationTargetDisplayNames}
            />
            <TablePagination
              totalItems={publicationsCount}
              currentItemCount={publications.length}
            />
          </>
        )}
      </>
    );
  };

  const actions =
    isGettingPublicationTargets ||
    isMissingTargets ||
    isGettingPublications ||
    isMissingPublications
      ? []
      : [<AddPublicationButton key="add-publication-button" />];

  return (
    <>
      <PageHeader title="Publications" actions={actions} />
      <PageContent hasTable>{getContent()}</PageContent>
    </>
  );
};

export default PublicationsContainer;
