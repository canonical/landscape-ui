import { FC, lazy, Suspense } from "react";
import { Distribution } from "../../../../types/Distribution";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import classes from "./EmptyDistribution.module.scss";
import LoadingState from "../../../../components/layout/LoadingState";

const NewSeriesForm = lazy(() => import("./NewSeriesForm"));

interface EmptyDistributionProps {
  distribution: Distribution;
}

const EmptyDistribution: FC<EmptyDistributionProps> = ({ distribution }) => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>No series have been created yet</h3>
      </div>
      <div className={classes.content}>
        <p className="u-no-margin--bottom">
          Create a new mirror or series to get started
        </p>
        <p className="u-no-margin--top">
          <a href="https://ubuntu.com/landscape/docs/repositories">
            How to manage repositories in Landscape
          </a>
        </p>
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={() => {
            setSidePanelOpen(true);
            setSidePanelContent(
              `Create mirror for ${distribution.name}`,
              <Suspense fallback={<LoadingState />}>
                <NewSeriesForm distributionData={distribution} />
              </Suspense>,
            );
          }}
          aria-label={`Create mirror for ${distribution.name}`}
        >
          Create mirror
        </Button>
      </div>
    </div>
  );
};

export default EmptyDistribution;
