import PublicationsList from "../PublicationsList";
import NoPublicationTargetEmptyState from "../NoPublicationsTargetEmptyState/NoPublicationTargetEmptyState";
import NoPublicationsEmptyState from "../NoPublicationsEmptyState/NoPublicationsEmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import useGetPublicationTargets from "../../api/useGetPublicationTargets";
import useGetPublications from "../../api/useGetPublications";

const PublicationsContainer = () => {
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { publications, publicationsCount, isGettingPublications } =
    useGetPublications();

  if (isGettingPublicationTargets || isGettingPublications) {
    return <LoadingState />;
  }

  if (publicationTargets.length === 0) {
    return <NoPublicationTargetEmptyState />;
  }

  if (publicationsCount === 0) {
    return <NoPublicationsEmptyState />;
  }

  return (
    <>
      <PublicationsList publications={publications} />
      <TablePagination totalItems={publicationsCount} />
    </>
  );
};

export default PublicationsContainer;
