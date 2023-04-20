import { FC, useEffect } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import useFetch from "../../../hooks/useFetch";
import { consoleErrorMessage } from "../../../utils/debug";

const RepositoriesPage: FC = () => {
  const authFetch = useFetch();

  const fetchProfiles = async () => {
    try {
      await authFetch!.get("GetRepositoryProfiles");
    } catch (error: any) {
      consoleErrorMessage(error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <PageMain>
      <PageHeader title="Repository Mirrors" />
      <PageContent>Repository Mirrors</PageContent>
    </PageMain>
  );
};

export default RepositoriesPage;
