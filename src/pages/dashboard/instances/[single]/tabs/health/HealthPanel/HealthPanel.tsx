import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  effectiveRecommendedActions,
  HealthActions,
  HealthFactorList,
  HealthScoreInfo,
  HealthScoreSummary,
  isHealthMeasurable,
  useComputerHealth,
} from "@/features/health";
import date from "@/libs/date";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { Card, Cards } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC } from "react";
import { useId } from "react";
import classes from "./HealthPanel.module.scss";

interface HealthPanelProps {
  readonly instance: Instance;
}

const HealthPanel: FC<HealthPanelProps> = ({ instance }) => {
  const measurable = isHealthMeasurable(instance);
  const query = useComputerHealth(measurable ? instance.id : 0);
  const titleIds = { score: useId(), factors: useId(), actions: useId() };

  if (!measurable) {
    // The tab is hidden for these instances, but a deep link can still land here.
    return (
      <EmptyState
        title="Health isn’t measured for this instance"
        icon="information"
        body={
          <>
            <p>
              The Instance Health Engine relies on signals reported by the
              Landscape client, which only runs on Ubuntu (server, desktop, and
              Core). This instance reports{" "}
              <strong>
                {instance.distribution_info?.distributor ?? "no distribution"}
              </strong>
              , so there&apos;s no score to surface.
            </p>
            <p>
              Status, activities, and other signals remain available via the
              other tabs.
            </p>
          </>
        }
      />
    );
  }

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <EmptyState
        title="Health unavailable"
        icon="error"
        body={
          <p>
            We couldn&apos;t load the health details for this instance. This is
            usually transient, so check back in a moment or retry.
          </p>
        }
        cta={[
          <Button
            type="button"
            key="retry"
            appearance="positive"
            onClick={() => {
              void query.refetch();
            }}
            disabled={query.isFetching}
          >
            {query.isFetching ? "Retrying…" : "Retry"}
          </Button>,
        ]}
      />
    );
  }

  const health = query.data.data;
  const { score, band, factors, updated_at } = health;
  const recommended = effectiveRecommendedActions(health);

  return (
    <div className={classNames("grid", classes.layout)}>
      <Cards>
        <Card className={classes.third} aria-labelledby={titleIds.score}>
          <Card.Header>
            <h2
              id={titleIds.score}
              className="p-heading--5 u-no-margin u-no-padding"
            >
              Health score
            </h2>
          </Card.Header>
          <Card.Content>
            <HealthScoreSummary
              score={score}
              band={band}
              hint={
                updated_at ? (
                  <>
                    Last evaluated{" "}
                    <time dateTime={updated_at}>
                      {date(updated_at).format(DISPLAY_DATE_TIME_FORMAT)}
                    </time>
                  </>
                ) : null
              }
            />
          </Card.Content>
        </Card>

        <Card className={classes.twoThirds} aria-labelledby={titleIds.factors}>
          <Card.Header>
            <h2
              id={titleIds.factors}
              className="p-heading--5 u-no-margin u-no-padding"
            >
              What is lowering the score
              <HealthScoreInfo />
            </h2>
            {factors.length > 0 ? (
              <span className="u-text--muted">
                {factors.length} {pluralize(factors.length, ["rule"])}
              </span>
            ) : null}
          </Card.Header>
          <Card.Content>
            <HealthFactorList factors={factors} />
          </Card.Content>
        </Card>

        {recommended.length > 0 ? (
          <Card className={classes.full} aria-labelledby={titleIds.actions}>
            <Card.Header>
              <h2
                id={titleIds.actions}
                className="p-heading--5 u-no-margin u-no-padding"
              >
                Recommended actions
              </h2>
            </Card.Header>
            <Card.Content>
              <HealthActions instance={instance} actions={recommended} />
            </Card.Content>
          </Card>
        ) : null}
      </Cards>
    </div>
  );
};

export default HealthPanel;
