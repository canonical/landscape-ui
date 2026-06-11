import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { Button, ConfirmationModal, Icon } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import { useState, type FC } from "react";
import { Link } from "react-router";
import {
  BAND_ICON,
  BAND_LABEL,
  HEALTH_ACTION_META,
  effectiveRecommendedActions,
} from "../../helpers";
import useComputerHealth from "../../hooks/useComputerHealth";
import useHealthAction from "../../hooks/useHealthAction";
import type { HealthActionKind } from "../../types";
import HealthFactorList from "../HealthFactorList";
import classes from "./HealthDetailsPanel.module.scss";

// LA061 Phase 1.7: destructive actions get a confirmation modal so a stray
// click can't reboot a production fleet. `refresh-facts` is read-only.
const DESTRUCTIVE_ACTIONS: ReadonlySet<HealthActionKind> = new Set([
  "reboot",
  "run-security-updates",
]);

// HTTP status codes the action endpoint returns. Named so each error toast
// reads as a single intent ("permission missing" rather than "403").
const STATUS_FORBIDDEN = 403;
const STATUS_CONFLICT = 409;
const STATUS_NOT_IMPLEMENTED = 501;

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
  const [activeAction, setActiveAction] = useState<HealthActionKind | null>(
    null,
  );
  const [confirming, setConfirming] = useState<HealthActionKind | null>(null);

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError || !query.data?.data) {
    // The side panel has no other content when the query fails — use the
    // full EmptyState rather than a Notification banner. Notification is the
    // right primitive only when there is surrounding content to keep.
    return (
      <EmptyState
        title="Health unavailable"
        icon="error"
        body={
          <p>
            We couldn&apos;t load the health details for this instance.
            This is usually transient — retry to refresh.
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
  const { score, band, factors, critical_factor_count, updated_at } = health;
  const recommended = effectiveRecommendedActions(health);

  const dispatch = (kind: HealthActionKind) => {
    setActiveAction(kind);
    action.mutate(
      { computerId: instance.id, action: kind },
      {
        onSuccess: () => {
          notify.success({
            message: `${HEALTH_ACTION_META[kind].label} dispatched.`,
          });
        },
        onError: (error) => {
          // LA061 Phase 1.7: surface contextual toasts based on the status
          // code so the operator gets actionable feedback rather than a
          // generic Axios error. Status codes match
          // canonical/landscape/api/health/errors.py.
          const status = error.response?.status;
          const message =
            error.response?.data?.message ?? "Action failed unexpectedly.";
          if (status === STATUS_FORBIDDEN) {
            notify.error({
              title: "Permission required",
              message: `You don't have permission to ${HEALTH_ACTION_META[kind].label.toLowerCase()}.`,
              error,
            });
          } else if (status === STATUS_CONFLICT) {
            notify.error({
              title: "Nothing to do",
              message,
              error,
            });
          } else if (status === STATUS_NOT_IMPLEMENTED) {
            notify.error({
              title: "Not available yet",
              message:
                "This remediation is still being wired up. Try one of the other actions.",
              error,
            });
          } else {
            notify.error({
              title: `${HEALTH_ACTION_META[kind].label} failed`,
              message,
              error,
            });
          }
        },
        onSettled: () => {
          setActiveAction(null);
          setConfirming(null);
        },
      },
    );
  };

  const requestAction = (kind: HealthActionKind) => {
    if (DESTRUCTIVE_ACTIONS.has(kind)) {
      setConfirming(kind);
      return;
    }
    dispatch(kind);
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
            const isBusy = action.isPending && activeAction === kind;
            return (
              <Button
                key={kind}
                appearance="base"
                className={classes.actionButton}
                onClick={() => {
                  requestAction(kind);
                }}
                disabled={action.isPending}
                aria-busy={isBusy}
              >
                <Icon name={isBusy ? "spinner" : meta.icon} />
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

      {confirming && (
        <ConfirmationModal
          close={() => {
            setConfirming(null);
          }}
          title={`${HEALTH_ACTION_META[confirming].label}?`}
          onConfirm={() => {
            dispatch(confirming);
          }}
          confirmButtonLabel={HEALTH_ACTION_META[confirming].label}
          confirmButtonAppearance={
            confirming === "reboot" ? "negative" : "positive"
          }
        >
          <p>
            {confirming === "reboot"
              ? `This will schedule an immediate reboot for ${instance.title}. In-flight work on the instance may be interrupted.`
              : `This will queue package upgrades for every open USN on ${instance.title}. Some services may restart as part of the upgrade.`}
          </p>
        </ConfirmationModal>
      )}

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
