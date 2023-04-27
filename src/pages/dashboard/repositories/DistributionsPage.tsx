import { FC } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import PageContent from "../../../components/layout/PageContent";
import useDistributions from "../../../hooks/useDistributions";
import DistributionCard from "./DistributionCard";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../components/layout/LoadingState";
import EmptyState from "../../../components/layout/EmptyState";

const DistributionsPage: FC = () => {
  const { getDistributionsQuery } = useDistributions();

  const { data, isLoading } = getDistributionsQuery();

  const items = data ?? [];

  return (
    <PageMain>
      <PageHeader
        title="Repository Mirrors"
        actions={[
          <Button key="new-mirror-button" appearance="positive">
            New mirror
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="No mirrors found."
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
              <Button appearance="positive" key="table-create-new-mirror">
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
