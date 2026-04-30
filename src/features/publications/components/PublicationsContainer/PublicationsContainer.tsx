import PublicationsList from "../PublicationsList";
import NoPublicationTargetEmptyState from "../NoPublicationsTargetEmptyState/NoPublicationTargetEmptyState";
import NoPublicationsEmptyState from "../NoPublicationsEmptyState/NoPublicationsEmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import PublicationsHeader from "../PublicationsHeader";
import { useMemo } from "react";
import {
  useBatchGetLocals,
  useBatchGetMirrors,
  useBatchGetPublicationTargets,
  useGetPublications,
  useGetPublicationTargets,
} from "../../api";

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

  if (
    isGettingPublicationTargets ||
    isGettingPublications ||
    isLoadingDisplayNames
  ) {
    return <LoadingState />;
  }

  if (publicationTargets.length === 0) {
    return <NoPublicationTargetEmptyState />;
  }

  if (publicationsCount === 0 && !query) {
    return <NoPublicationsEmptyState />;
  }

  return (
    <>
      <PublicationsHeader />
      <PublicationsList
        publications={publications}
        sourceDisplayNames={sourceDisplayNames}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />
      <TablePagination totalItems={publicationsCount} />
    </>
  );
};

export default PublicationsContainer;
