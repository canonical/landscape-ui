import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { Link } from "react-router";
import {
  BAND_ICON,
  BAND_LABEL,
  HEALTH_ACTION_META,
  recommendedActionsFor,
} from "../../helpers";
import useComputerHealth from "../../hooks/useComputerHealth";
import useHealthAction from "../../hooks/useHealthAction";
import type { HealthActionKind } from "../../types";
import HealthFactorList from "../HealthFactorList";
import classes from "./HealthDetailsPanel.module.scss";

const DATE_FORMAT = "MMM D, YYYY \\a\\t HH:mm";

interface HealthDetailsPanelProps {
  readonly instance: Pick<
    Instance | InstanceWithoutRelation,
    "id" | "title" | "hostname"
  >;
}

const HealthDetailsPanel: FC<HealthDetailsPanelProps> = ({ instance }) => {
  const query = useComputerHealth(instance.id);
  const action = useHealthAction();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <div className={classes.errorState} role="alert">
        <Icon name="error" />
        <span>
          Couldn&apos;t load health for this instance. Try again in a moment.
        </span>
      </div>
    );
  }

  const health = query.data.data;
  const { score, band, factors, critical_factor_count, updated_at } = health;
  const recommended = recommendedActionsFor(factors);

  const dispatch = (kind: HealthActionKind) => {
    action.mutate(
      { computerId: instance.id, action: kind },
      {
        onSuccess: () => {
          notify.success({
            message: `${HEALTH_ACTION_META[kind].label} dispatched.`,
          });
        },
      },
    );
  };

  return (
    <div className={classes.root}>
      <header className={classNames(classes.hero, classes[`hero_${band}`])}>
        <div className={classes.heroIcon} aria-hidden="true">
          <Icon name={BAND_ICON[band]} />
        </div>
        <div className={classes.heroNumbers}>
          <span className={classes.heroScore}>{score}</span>
          <span className={classes.heroUnit}>/ 100</span>
        </div>
        <div className={classes.heroMeta}>
          <span className={classes.heroBand}>{BAND_LABEL[band]}</span>
          {critical_factor_count > 1 && (
            <span className={classes.heroCriticalChip}>
              ×{critical_factor_count} critical factors
            </span>
          )}
          {updated_at && (
            <span className={classes.heroUpdated}>
              Last evaluated{" "}
              <time dateTime={updated_at}>
                {moment(updated_at).format(DATE_FORMAT)}
              </time>
            </span>
          )}
        </div>
      </header>

      <section className={classes.section}>
        <h3 className={classes.sectionTitle}>Why this score?</h3>
        {factors.length === 0 ? (
          <p className={classes.clean}>
            <Icon name="success" /> Nothing is dragging this instance&apos;s
            score down right now.
          </p>
        ) : (
          <HealthFactorList factors={factors} />
        )}
      </section>

      <section className={classes.section}>
        <h3 className={classes.sectionTitle}>Quick actions</h3>
        <p className={classes.sectionHint}>
          Dispatch a remediation directly. These run via the same activity
          system as the buttons on the Info tab.
        </p>
        <div className={classes.actionGrid}>
          {recommended.map((kind) => {
            const meta = HEALTH_ACTION_META[kind];
            return (
              <Button
                key={kind}
                appearance="base"
                className={classes.actionButton}
                onClick={() => {
                  dispatch(kind);
                }}
                disabled={action.isPending}
              >
                <span className={classes.actionIcon} aria-hidden="true">
                  <Icon name={meta.icon} />
                </span>
                <span className={classes.actionBody}>
                  <strong>{meta.label}</strong>
                  <span className={classes.actionDescription}>
                    {meta.description}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      <footer className={classes.footer}>
        <Link
          to={ROUTES.instances.details.single(instance.id, { tab: "health" })}
          className={classes.openTabLink}
          onClick={() => {
            closeSidePanel();
          }}
        >
          <span>Open full Health tab</span>
          <Icon name="external-link" />
        </Link>
      </footer>
    </div>
  );
};

export default HealthDetailsPanel;
