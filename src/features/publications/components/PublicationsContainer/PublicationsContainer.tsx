import PublicationsList from "../PublicationsList";
import { TablePagination } from "@/components/layout/TablePagination";
import useGetPublications from "../../api/useGetPublications";

const PublicationsContainer = () => {
  const { publications, publicationsCount } = useGetPublications();

  return (
    <>
      <PublicationsList publications={publications} />
      <TablePagination totalItems={publicationsCount} />
    </>
  );
};

export default PublicationsContainer;
