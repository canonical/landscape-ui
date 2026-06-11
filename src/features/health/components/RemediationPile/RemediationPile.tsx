// LA061 Phase 1.8: Remediation Pile — three action cards on the Overview
// answering the org admin's "what should I do next?"
//
// Each card maps to one already-existing bulk-action flow:
//   - Apply security updates → opens the same `<Upgrades>` side panel the
//     instances-page Operations > Upgrade action uses. We trust the
//     health-engine-filtered selection (instances with `usn.*` factors) and
//     default the panel to its USN tab so the operator can refine before
//     applying.
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
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { Suspense, lazy, useMemo, useState } from "react";
import type { Instance } from "@/types/Instance";
import type {
  FleetTopDetractor,
  HealthActionKind,
} from "../../types";
import classes from "./RemediationPile.module.scss";

const Upgrades = lazy(
  async () => import("@/features/upgrades/components/Upgrades"),
);

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
    subtitle: "Instances waiting for a reboot to apply kernel or system updates.",
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
  const refreshFacts = useHealthAction();
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();

  // Per-card modal / in-flight state. We track the "open modal" by action
  // kind so confirmation dialogs are mutually exclusive and per-card
  // spinners can show only on the card that's actually running.
  const [modalAction, setModalAction] = useState<HealthActionKind | null>(null);
  const [pendingRefreshIds, setPendingRefreshIds] = useState<number[] | null>(null);

  const instancesForRuleKeys = (ruleKeys: string[]): Instance[] => {
    const set = new Set(ruleKeys);
    return (instancesQuery.instances ?? []).filter((i) =>
      (i.health?.factors ?? []).some((f) => set.has(f.rule_key)),
    );
  };

  const cards = useMemo(
    () =>
      CARDS.map((card) => {
        // The detractor sum stays meaningful as the points-cleared metric
        // (per-rule weight × per-rule distinct-computer count, accumulated).
        // The displayed count switches to the de-duped instance set so a
        // computer hit by both `usn.critical` and `usn.medium` is counted
        // once — matches the set the action actually targets.
        const detractorMetric = aggregate(detractors, card.affectedRuleKeys);
        const matchedInstances = instancesForRuleKeys(card.affectedRuleKeys);
        return {
          spec: card,
          metric: {
            computerCount: matchedInstances.length,
            penalty: detractorMetric.penalty,
          },
        };
      }),
    [detractors, instancesQuery.instances],
  );

  const kernelWaivedCount =
    summaryQuery.data?.data.kernel_usns_waived_count ?? 0;

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
      // Hand the health-engine-filtered set to the same `<Upgrades>` side
      // panel the instances-page Operations > Upgrade flow uses. The panel
      // owns the `UpgradeInfo` header, per-USN/per-package exclusion tabs,
      // and the submission lifecycle — we just pre-select the rows and
      // default to the USN tab. `trustSelection` tells it not to re-filter
      // by `Instance.alerts`, since the health engine reads `usn_issue`
      // directly and may flag instances whose `SecurityUpgradesAlert`
      // hasn't propagated yet.
      setSidePanelContent(
        "Apply security updates",
        <Suspense fallback={<LoadingState />}>
          <Upgrades
            selectedInstances={matched}
            trustSelection
            initialTabId="tab-link-usns"
          />
        </Suspense>,
        "large",
      );
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
    modalAction === "reboot"
      ? instancesForRuleKeys(["reboot_required"])
      : [];

  const hasAnyWork = cards.some((c) => c.metric.computerCount > 0);

  if (
    detractorsQuery.isLoading
    || summaryQuery.isLoading
    || (!hasAnyWork && detractorsQuery.isSuccess)
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
            metric.computerCount === 0
            || instancesQuery.isGettingInstances
            || (spec.action === "refresh-facts" && pendingRefreshIds !== null);
          const isThisActionRunning =
            (spec.action === "refresh-facts" && pendingRefreshIds !== null)
            || (spec.action === "reboot" && modalAction === "reboot");
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
              {spec.action === "run-security-updates" && kernelWaivedCount > 0 && (
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
    </>
  );
};

export default RemediationPile;
