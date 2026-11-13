import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";
import { effectiveRecommendedActions } from "../../helpers";
import useComputerHealth from "../../hooks/useComputerHealth";
import HealthActions from "../HealthActions";
import HealthFactorList from "../HealthFactorList";
import HealthScoreInfo from "../HealthScoreInfo";
import HealthScoreSummary from "../HealthScoreSummary";
import classes from "./HealthDetailsPanel.module.scss";

interface HealthDetailsPanelProps {
  readonly instance: Pick<
    Instance | InstanceWithoutRelation,
    "id" | "title" | "hostname"
  >;
}

const HealthDetailsPanel: FC<HealthDetailsPanelProps> = ({ instance }) => {
  const query = useComputerHealth(instance.id);
  const { closeSidePanel } = useSidePanel();

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
            usually transient, so retry to refresh.
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
  const recommended = effectiveRecommendedActions(health);

  return (
    <div className={classes.root}>
      <HealthScoreSummary
        score={health.score}
        band={health.band}
        hint={
          health.updated_at ? (
            <>
              Last evaluated{" "}
              <time dateTime={health.updated_at}>
                {date(health.updated_at).format(DISPLAY_DATE_TIME_FORMAT)}
              </time>
            </>
          ) : null
        }
      />

      <section className={classes.section}>
        <h3 className="p-heading--5 u-no-margin u-no-padding">
          What is lowering the score
          <HealthScoreInfo />
        </h3>
        <HealthFactorList factors={health.factors} />
      </section>

      {recommended.length > 0 ? (
        <section className={classes.section}>
          <h3 className="p-heading--5 u-no-margin u-no-padding">
            Recommended actions
          </h3>
          <HealthActions instance={instance} actions={recommended} />
        </section>
      ) : null}

      <p className={classes.more}>
        <Link
          to={ROUTES.instances.details.single(instance.id, { tab: "health" })}
          onClick={() => {
            closeSidePanel();
          }}
        >
          Open the Health tab
        </Link>
      </p>
    </div>
  );
};

export default HealthDetailsPanel;
