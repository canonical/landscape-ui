import Blocks from "@/components/layout/Blocks";
import HeaderActions from "@/components/layout/HeaderActions";
import LoadingState from "@/components/layout/LoadingState";
import {
  BAND_LABEL,
  HEALTH_ACTION_META,
  HealthFactorList,
  isHealthMeasurable,
  recommendedActionsFor,
  useComputerHealth,
  useHealthAction,
} from "@/features/health";
import type {
  HealthActionKind,
  HealthBand,
  HealthFactor,
} from "@/features/health";
import useNotify from "@/hooks/useNotify";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { Link } from "react-router";
import classes from "./HealthPanel.module.scss";

const DATE_FORMAT = "MMM D, YYYY \\a\\t HH:mm";

const BAND_ICON: Record<HealthBand, string> = {
  critical: "error",
  warning: "warning",
  healthy: "success",
};

interface HealthPanelProps {
  readonly instance: Instance;
}

const bandClassName = (band: HealthBand): string =>
  classes[`band_${band}`] ?? "";

const HealthPanel: FC<HealthPanelProps> = ({ instance }) => {
  const measurable = isHealthMeasurable(instance);
  const query = useComputerHealth(measurable ? instance.id : 0);
  const action = useHealthAction();
  const { notify } = useNotify();

  if (!measurable) {
    return (
      <section className={classes.notMeasurable}>
        <Icon name="information" />
        <div>
          <h2 className={classes.notMeasurableTitle}>
            Health isn&apos;t measured for this instance
          </h2>
          <p>
            The Instance Health Engine relies on signals reported by the
            Landscape client, which only runs on Ubuntu (server, desktop,
            and Core). This instance reports{" "}
            <strong>
              {instance.distribution_info?.distributor ?? "no distribution"}
            </strong>
            , so there&apos;s no score to surface.
          </p>
          <p>
            Status, activities, and other signals remain available via the
            other tabs.
          </p>
        </div>
      </section>
    );
  }

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <section className={classes.errorState} role="alert">
        <Icon name="error" />
        <span>
          Couldn&apos;t load health for this instance. Try again in a
          moment.
        </span>
      </section>
    );
  }

  const health = query.data.data;
  const { score, band, factors, critical_factor_count, updated_at } = health;
  const recommended: HealthActionKind[] = recommendedActionsFor(factors);

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

  const isDispatching = action.isPending;

  return (
    <>
      <HeaderActions
        title={
          <div className={classes.titleRow}>
            <h2
              className={classNames(
                "p-heading--4 u-no-padding--top u-no-margin--bottom",
                classes.heading,
              )}
            >
              Health for {instance.title}
            </h2>
            <span
              className={classNames(classes.bandPill, bandClassName(band))}
            >
              <Icon name={BAND_ICON[band]} />
              <strong>{score}</strong>
              <span>/ 100 · {BAND_LABEL[band]}</span>
              {critical_factor_count > 1 && (
                <span className={classes.criticalChip}>
                  ×{critical_factor_count} critical
                </span>
              )}
            </span>
          </div>
        }
        actions={{
          nondestructive: recommended.map((kind) => {
            const meta = HEALTH_ACTION_META[kind];
            return {
              icon: meta.icon,
              label: meta.label,
              onClick: () => {
                dispatch(kind);
              },
              disabled: isDispatching,
            };
          }),
        }}
      />

      <Blocks spaced>
        <Blocks.Item title="Why this score?">
          {factors.length === 0 ? (
            <p className={classes.cleanState}>
              <Icon name="success" /> Nothing is dragging this instance&apos;s
              score down right now.
            </p>
          ) : (
            <>
              <p className={classes.bodyHint}>
                {factors.length === 1
                  ? "One rule is currently subtracting from this instance's score."
                  : `${factors.length} rules are currently subtracting from this instance's score.`}{" "}
                Click any recommended action above to dispatch the matching
                remedy.
              </p>
              <HealthFactorList factors={factors} />
            </>
          )}
          {updated_at && (
            <p className={classes.footnote}>
              Last evaluated{" "}
              <time dateTime={updated_at}>
                {moment(updated_at).format(DATE_FORMAT)}
              </time>
              .
            </p>
          )}
        </Blocks.Item>

        <Blocks.Item title="Recommended actions">
          <ul className={classes.actionExplainer}>
            {recommended.map((kind) => {
              const meta = HEALTH_ACTION_META[kind];
              const triggeringFactor = factors.find(
                (f: HealthFactor) =>
                  // The mapping mirrors `suggestedActionFor` in helpers.ts.
                  (kind === "run-security-updates" &&
                    f.rule_key.startsWith("usn.")) ||
                  (kind === "run-security-updates" &&
                    f.rule_key === "package.updates_available") ||
                  (kind === "reboot" && f.rule_key === "reboot_required") ||
                  (kind === "refresh-facts" &&
                    f.rule_key === "instance.offline"),
              );
              return (
                <li key={kind} className={classes.actionRow}>
                  <span className={classes.actionIcon} aria-hidden="true">
                    <Icon name={meta.icon} />
                  </span>
                  <div className={classes.actionBody}>
                    <strong>{meta.label}</strong>
                    <span className={classes.actionDescription}>
                      {meta.description}
                    </span>
                    {triggeringFactor && (
                      <span className={classes.actionBecause}>
                        Triggered by: <em>{triggeringFactor.description}</em>{" "}
                        (−{triggeringFactor.points})
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Blocks.Item>

        <Blocks.Item title="Related signals">
          <ul className={classes.relatedList}>
            <li>
              <Link
                to={ROUTES.instances.details.single(instance.id, {
                  tab: "activities",
                })}
                className={classes.relatedLink}
              >
                <Icon name="status-in-progress" />
                <span>Activities</span>
                <span className={classes.relatedHint}>
                  Recent agent activity, scheduled jobs, results
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.instances.details.single(instance.id, {
                  tab: "security-issues",
                })}
                className={classes.relatedLink}
              >
                <Icon name="security-tick" />
                <span>Security issues</span>
                <span className={classes.relatedHint}>
                  USN-priority breakdown driving the score
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.instances.details.single(instance.id, {
                  tab: "packages",
                })}
                className={classes.relatedLink}
              >
                <Icon name="applications" />
                <span>Packages</span>
                <span className={classes.relatedHint}>
                  Pending updates feed the score subtractions
                </span>
              </Link>
            </li>
          </ul>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default HealthPanel;
