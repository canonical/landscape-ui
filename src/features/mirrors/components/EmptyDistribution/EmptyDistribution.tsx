import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { Distribution } from "../../types";
import classes from "./EmptyDistribution.module.scss";

const NewSeriesForm = lazy(async () => import("../NewSeriesForm"));

interface EmptyDistributionProps {
  readonly distribution: Distribution;
}

const EmptyDistribution: FC<EmptyDistributionProps> = ({ distribution }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddMirror = (): void => {
    setSidePanelContent(
      `Add mirror for ${distribution.name}`,
      <Suspense fallback={<LoadingState />}>
        <NewSeriesForm distribution={distribution} />
      </Suspense>,
    );
  };

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
          type="button"
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={handleAddMirror}
          aria-label={`Add mirror for ${distribution.name}`}
        >
          Add mirror
        </Button>
      </div>
    </div>
  );
};

export default EmptyDistribution;
