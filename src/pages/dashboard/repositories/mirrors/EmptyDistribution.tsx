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
  const { setSidePanelContent } = useSidePanel();

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h3 className={classes.title}>No series have been added yet</h3>
      </div>
      <div className={classes.content}>
        <p className="u-no-margin--bottom">
          Add a new mirror or series to get started
        </p>
        <p className="u-no-margin--top">
          <a
            href="https://ubuntu.com/landscape/docs/repositories"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage repositories in Landscape
          </a>
        </p>
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={() => {
            setSidePanelContent(
              `Add mirror for ${distribution.name}`,
              <Suspense fallback={<LoadingState />}>
                <NewSeriesForm distribution={distribution} />
              </Suspense>,
            );
          }}
          aria-label={`Add mirror for ${distribution.name}`}
        >
          Add mirror
        </Button>
      </div>
    </div>
  );
};

export default EmptyDistribution;
