import { FC } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import DistributionCard from "./DistributionCard";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../components/layout/LoadingState";
import EmptyState from "../../../components/layout/EmptyState";
import useSidePanel from "../../../hooks/useSidePanel";
import NewMirrorForm from "./NewMirrorForm";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import useDebug from "../../../hooks/useDebug";
import { Distribution } from "../../../types/Distribution";
import { AxiosError } from "axios";
import { ApiError } from "../../../types/ApiError";

const DistributionsPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  const authFetch = useFetch();
  const debug = useDebug();

  const { data, isLoading } = useQuery<Distribution[], AxiosError<ApiError>>({
    queryKey: ["distributions"],
    queryFn: () =>
      authFetch!
        .get("GetDistributions")
        .then(({ data }) => data ?? [])
        .catch(debug),
  });

  const items = data ?? [];

  const handleOpen = () => {
    setSidePanelOpen(true);
    setSidePanelContent("New mirror", <NewMirrorForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Repository Mirrors"
        actions={[
          <Button
            key="new-mirror-button"
            appearance="positive"
            onClick={handleOpen}
            type="button"
          >
            New mirror
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="No mirrors found"
            icon="containers"
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven’t created any repository mirrors yet.
                </p>
                <a href="https://ubuntu.com/landscape/docs/repositories">
                  How to manage repositories in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="table-create-new-mirror"
                onClick={handleOpen}
                type="button"
              >
                New mirror
              </Button>,
            ]}
          />
        )}
        {!isLoading &&
          items.length > 0 &&
          items.map((item) => <DistributionCard key={item.name} item={item} />)}
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
