import { FC } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../components/layout/LoadingState";
import EmptyState from "../../../components/layout/EmptyState";
import useSidePanel from "../../../hooks/useSidePanel";
import NewSeriesForm from "./NewSeriesForm";
import useDistributions from "../../../hooks/useDistributions";
import DistributionCard from "./DistributionCard";
import NewDistributionForm from "./NewDistributionForm";

const DistributionsPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { getDistributionsQuery } = useDistributions();
  const { data, isLoading } = getDistributionsQuery();

  const items = data?.data ?? [];

  const handleOpen = () => {
    setSidePanelOpen(true);
    setSidePanelContent("New mirror", <NewSeriesForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Repository Mirrors"
        actions={[
          <Button
            key="create-distribution-button"
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                "Create distribution",
                <NewDistributionForm />
              );
            }}
            type="button"
            className="u-no-margin--right"
          >
            Create distribution
          </Button>,
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
          items.map((item) => (
            <DistributionCard key={item.name} distribution={item} />
          ))}
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
