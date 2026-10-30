// LA061 Phase 1.8: Remediation Pile — three action cards on the Overview
// answering the org admin's "what should I do next?"
//
// Each card maps to one already-existing bulk-action flow:
//   - Apply security updates → `useUsns().upgradeUsnsQuery` (POST
//     /computers/usns/upgrade-packages), the same endpoint the USNs page
//     uses for bulk apply.
//   - Reboot               → `RestartModal` (uses `useRestartInstances`,
//     same flow as the instance-list "Restart" bulk action).
//   - Refresh stale        → server-side mark-dirty for each affected
//     instance, the existing per-computer endpoint
//     `/computers/{id}/health/actions` with `action: "refresh-facts"`.
//
// We do NOT use the new bulk health-action endpoint here — the user wants
// the dashboard to fire the existing instance-page flows so behaviour is
// uniform across surfaces. Improvements (cross-cutting bulk health
// actions, scheduling, etc.) are a separate follow-up feature.

import { useFleetTopDetractors } from "../../hooks";
import useHealthAction from "../../hooks/useHealthAction";
import useFleetHealthSummary from "../../hooks/useFleetHealthSummary";
import { useGetInstances } from "@/features/instances/api/useGetInstances";
import { RestartModal } from "@/features/instances";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useUsns from "@/features/usns/hooks/useUsns";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { Instance } from "@/types/Instance";
import type { FleetTopDetractor, HealthActionKind } from "../../types";
import classes from "./RemediationPile.module.scss";

interface CardSpec {
  action: HealthActionKind;
  title: string;
  subtitle: string;
  affectedRuleKeys: string[];
  emptyCopy: string;
}

// The three actions LA061 Phase 1.7 wired. Each card maps to one
// HealthActionKind and reads its "what's pending" count from the
// detractors response (rule_key → computer_count) for the rule_keys it
// targets.
const CARDS: CardSpec[] = [
  {
    action: "run-security-updates",
    title: "Apply security updates",
    subtitle: "Pending Ubuntu security notices on this fleet.",
    affectedRuleKeys: ["usn.critical", "usn.high", "usn.medium", "usn.low"],
    emptyCopy: "No outstanding security notices.",
  },
  {
    action: "reboot",
    title: "Reboot pending",
    subtitle:
      "Instances waiting for a reboot to apply kernel or system updates.",
    affectedRuleKeys: ["reboot_required"],
    emptyCopy: "No reboots needed.",
  },
  {
    action: "refresh-facts",
    title: "Refresh stale instances",
    subtitle: "Instances that haven't exchanged with Landscape recently.",
    affectedRuleKeys: ["instance.offline"],
    emptyCopy: "Every instance has checked in recently.",
  },
];

interface AggregatedMetric {
  computerCount: number;
  penalty: number;
}

const aggregate = (
  detractors: FleetTopDetractor[],
  ruleKeys: string[],
): AggregatedMetric => {
  const set = new Set(ruleKeys);
  let computerCount = 0;
  let penalty = 0;
  for (const d of detractors) {
    if (!set.has(d.rule_key)) continue;
    computerCount += d.computer_count;
    penalty += d.weight * d.computer_count;
  }
  return { computerCount, penalty };
};

const RemediationPile: FC = () => {
  const detractorsQuery = useFleetTopDetractors(50);
  const summaryQuery = useFleetHealthSummary();
  const detractors = detractorsQuery.data?.data.results ?? [];
  // The instance list scoped to "anything with a factor we can act on" —
  // critical + warning. Filtered client-side per card at action-time.
  const instancesQuery = useGetInstances({
    limit: 50,
    health_band: "critical,warning",
    with_health: true,
  });
  const { upgradeUsnsQuery } = useUsns();
  const refreshFacts = useHealthAction();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { notify } = useNotify();
  const debug = useDebug();

  // Per-card modal / in-flight state. We track the "open modal" by action
  // kind so confirmation dialogs are mutually exclusive and per-card
  // spinners can show only on the card that's actually running.
  const [modalAction, setModalAction] = useState<HealthActionKind | null>(null);
  const [pendingRefreshIds, setPendingRefreshIds] = useState<number[] | null>(
    null,
  );

  const cards = useMemo(
    () =>
      CARDS.map((card) => ({
        spec: card,
        metric: aggregate(detractors, card.affectedRuleKeys),
      })),
    [detractors],
  );

  const kernelWaivedCount =
    summaryQuery.data?.data.kernel_usns_waived_count ?? 0;

  const instancesForRuleKeys = (ruleKeys: string[]): Instance[] => {
    const set = new Set(ruleKeys);
    return (instancesQuery.instances ?? []).filter((i) =>
      (i.health?.factors ?? []).some((f) => set.has(f.rule_key)),
    );
  };

  const onCardClick = async (card: CardSpec): Promise<void> => {
    const matched = instancesForRuleKeys(card.affectedRuleKeys);
    if (matched.length === 0) return;
    if (card.action === "reboot") {
      // RestartModal opens its own confirmation; we just record which
      // ids it should operate on.
      setModalAction("reboot");
      return;
    }
    if (card.action === "run-security-updates") {
      setModalAction("run-security-updates");
      return;
    }
    // refresh-facts dispatches immediately — it's non-destructive.
    const ids = matched.map((i) => i.id);
    setPendingRefreshIds(ids);
    try {
      // Fire one per-computer mark-dirty per affected instance. The
      // existing per-computer endpoint is the right granularity for this
      // action; no bulk endpoint needed because nothing leaves the server.
      await Promise.all(
        ids.map((id) =>
          refreshFacts.mutateAsync({ computerId: id, action: "refresh-facts" }),
        ),
      );
      notify.success({
        title: "Refresh queued",
        message: `Re-evaluation queued for ${ids.length} instance${
          ids.length === 1 ? "" : "s"
        }.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      setPendingRefreshIds(null);
    }
  };

  const rebootInstances =
    modalAction === "reboot" ? instancesForRuleKeys(["reboot_required"]) : [];
  const securityInstances =
    modalAction === "run-security-updates"
      ? instancesForRuleKeys([
          "usn.critical",
          "usn.high",
          "usn.medium",
          "usn.low",
        ])
      : [];

  const handleApplyUpgrade = async (): Promise<void> => {
    const ids = securityInstances.map((i) => i.id);
    if (ids.length === 0) {
      setModalAction(null);
      return;
    }
    try {
      const response = await upgradeUsnsQuery.mutateAsync({
        // POST /computers/usns/upgrade-packages takes
        // `{computers: [{id, exclude_usns: []}]}`. An empty exclude_usns
        // means "all open USNs for this instance," which matches the
        // dashboard CTA semantics ("Apply security updates").
        computers: ids.map((id) => ({ id, exclude_usns: [] })),
      });
      notify.success({
        title: `Security updates queued for ${ids.length} instance${
          ids.length === 1 ? "" : "s"
        }.`,
        message: "An activity has been queued to upgrade pending USNs.",
        actions: response.data
          ? [
              {
                label: "View details",
                onClick: () => {
                  openActivityDetails(response.data);
                },
              },
            ]
          : undefined,
      });
    } catch (error) {
      debug(error);
    } finally {
      setModalAction(null);
    }
  };

  const hasAnyWork = cards.some((c) => c.metric.computerCount > 0);

  if (
    detractorsQuery.isLoading ||
    summaryQuery.isLoading ||
    (!hasAnyWork && detractorsQuery.isSuccess)
  ) {
    return (
      <div className={classes.container}>
        {!hasAnyWork && detractorsQuery.isSuccess ? (
          <div className={classes.empty}>
            <Icon name="success" />
            <p className="u-no-margin--bottom">Fleet is fully remediated.</p>
          </div>
        ) : (
          <div className={classes.empty}>Loading remediation pile…</div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={classes.container}>
        {cards.map(({ spec, metric }) => {
          const disabled =
            metric.computerCount === 0 ||
            instancesQuery.isGettingInstances ||
            (spec.action === "refresh-facts" && pendingRefreshIds !== null);
          const isThisActionRunning =
            (spec.action === "refresh-facts" && pendingRefreshIds !== null) ||
            (spec.action === "reboot" && modalAction === "reboot") ||
            (spec.action === "run-security-updates" &&
              modalAction === "run-security-updates");
          return (
            <article key={spec.action} className={classes.card}>
              <header className={classes.cardHeader}>
                <p className="p-heading--5 u-no-margin--bottom">{spec.title}</p>
              </header>
              <p className={classes.cardSubtitle}>{spec.subtitle}</p>
              {metric.computerCount === 0 ? (
                <p
                  className={classNames(
                    classes.cardSubtitle,
                    "u-no-margin--bottom",
                  )}
                >
                  {spec.emptyCopy}
                </p>
              ) : (
                <div className={classes.metricRow}>
                  <p className={classes.metricCount}>
                    {metric.computerCount} instance
                    {metric.computerCount === 1 ? "" : "s"}
                  </p>
                  <p className={classes.metricPenalty}>
                    −{metric.penalty} points
                  </p>
                </div>
              )}
              {spec.action === "run-security-updates" &&
                kernelWaivedCount > 0 && (
                  <div className={classes.proBadge}>
                    <Icon name="security" />
                    {kernelWaivedCount} kernel USN
                    {kernelWaivedCount === 1 ? "" : "s"} waived by Livepatch
                  </div>
                )}
              <div className={classes.actions}>
                <button
                  type="button"
                  className={
                    spec.action === "refresh-facts"
                      ? "p-button"
                      : "p-button--positive"
                  }
                  disabled={disabled}
                  onClick={() => {
                    void onCardClick(spec);
                  }}
                >
                  {isThisActionRunning
                    ? "Working…"
                    : metric.computerCount === 0
                      ? "Nothing to do"
                      : `Run on ${metric.computerCount} instance${
                          metric.computerCount === 1 ? "" : "s"
                        }`}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {modalAction === "reboot" && rebootInstances.length > 0 && (
        <RestartModal
          instances={rebootInstances}
          close={() => {
            setModalAction(null);
          }}
        />
      )}
      {modalAction === "run-security-updates" &&
        securityInstances.length > 0 && (
          <ConfirmationModal
            close={() => {
              setModalAction(null);
            }}
            title={`Apply security updates on ${securityInstances.length} instance${
              securityInstances.length === 1 ? "" : "s"
            }`}
            confirmButtonLabel="Apply"
            confirmButtonAppearance="positive"
            confirmButtonLoading={upgradeUsnsQuery.isPending}
            onConfirm={() => {
              void handleApplyUpgrade();
            }}
          >
            <p>
              All open Ubuntu security notices will be applied to{" "}
              {securityInstances.length} instance
              {securityInstances.length === 1 ? "" : "s"} with pending USNs.
            </p>
          </ConfirmationModal>
        )}
    </>
  );
};

export default RemediationPile;
