import { FC } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";
import EmptyState from "../../../../components/layout/EmptyState";
import useSidePanel from "../../../../hooks/useSidePanel";
import useDistributions from "../../../../hooks/useDistributions";
import DistributionCard from "./DistributionCard";
import NewDistributionForm from "./NewDistributionForm";
import NewMirrorForm from "./NewMirrorForm";
import useDebug from "../../../../hooks/useDebug";

const DistributionsPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { getDistributionsQuery } = useDistributions();
  const { data, isLoading, error } = getDistributionsQuery();
  const debug = useDebug();

  if (error) {
    debug(error);
  }

  const distributions = data?.data ?? [];

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
                <NewDistributionForm />,
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
            onClick={() => {
              setSidePanelOpen(true);
              setSidePanelContent(
                "Create new mirror",
                <NewMirrorForm distributions={distributions} />,
              );
            }}
            type="button"
            className="u-no-margin--right"
            disabled={0 === distributions.length}
          >
            Create mirror
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && distributions.length === 0 && (
          <EmptyState
            title="No mirrors have been created yet"
            icon="containers"
            body={
              <>
                <p className="u-no-margin--bottom">
                  To create a new mirror you must first create a distribution
                </p>
                <a href="https://ubuntu.com/landscape/docs/repositories">
                  How to manage repositories in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                key="create-distribution"
                onClick={() => {
                  setSidePanelOpen(true);
                  setSidePanelContent(
                    "Create distribution",
                    <NewDistributionForm />,
                  );
                }}
                type="button"
              >
                Create distribution
              </Button>,
            ]}
          />
        )}
        {!isLoading &&
          distributions.length > 0 &&
          distributions.map((distribution) => (
            <DistributionCard
              key={distribution.name}
              distribution={distribution}
            />
          ))}
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
