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

import LoadingState from "@/components/layout/LoadingState";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import { RestartModal, useGetInstances } from "@/features/instances";
import { useUsns } from "@/features/usns";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { Button, Chip, ConfirmationModal } from "@canonical/react-components";
import type { IconName } from "@canonical/ds-assets";
import { Card, Icon } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useFleetTopDetractors } from "../../hooks";
import useFleetHealthSummary from "../../hooks/useFleetHealthSummary";
import useHealthAction from "../../hooks/useHealthAction";
import type { FleetTopDetractor, HealthActionKind } from "../../types";
import classes from "./RemediationPile.module.scss";

const FETCH_LIMIT = 50;

interface CardSpec {
  action: HealthActionKind;
  title: string;
  subtitle: string;
  actionLabel: string;
  icon: IconName;
  criticality: "error" | "warning" | "information";
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
    actionLabel: "Apply updates",
    icon: "security-warning",
    criticality: "error",
    affectedRuleKeys: ["usn.critical", "usn.high", "usn.medium", "usn.low"],
    emptyCopy: "No outstanding security notices.",
  },
  {
    action: "reboot",
    title: "Reboot pending",
    subtitle:
      "Instances waiting for a reboot to apply kernel or system updates.",
    actionLabel: "Reboot instances",
    icon: "restart",
    criticality: "warning",
    affectedRuleKeys: ["reboot_required"],
    emptyCopy: "No reboots needed.",
  },
  {
    action: "refresh-facts",
    title: "Refresh stale instances",
    subtitle: "Instances that haven't exchanged with Landscape recently.",
    actionLabel: "Refresh instances",
    icon: "disconnected",
    criticality: "information",
    affectedRuleKeys: ["instance.offline"],
    emptyCopy: "Every instance has checked in recently.",
  },
];

// The server counts distinct instances per rule, so a card backed by one rule
// has an exact count. Across several rules an instance can appear more than
// once, so only the largest per-rule count is certain.
const getRuleCounts = (
  detractors: FleetTopDetractor[],
  ruleKeys: string[],
): number[] =>
  detractors
    .filter(({ rule_key }) => ruleKeys.includes(rule_key))
    .map(({ computer_count }) => computer_count);

interface RemediationPileProps {
  readonly className?: string;
  readonly fullWidthClassName?: string;
}

const RemediationPile: FC<RemediationPileProps> = ({
  className,
  fullWidthClassName,
}) => {
  const detractorsQuery = useFleetTopDetractors(FETCH_LIMIT);
  const summaryQuery = useFleetHealthSummary();
  const detractors = useMemo(
    () => detractorsQuery.data?.data.results ?? [],
    [detractorsQuery.data],
  );
  // The instance list scoped to "anything with a factor we can act on" —
  // critical + warning. Filtered client-side per card at action-time.
  const instancesQuery = useGetInstances({
    limit: FETCH_LIMIT,
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

  const instancesForRuleKeys = useCallback(
    (ruleKeys: string[]): Instance[] =>
      instancesQuery.instances.filter(({ health }) =>
        (health?.factors ?? []).some(({ rule_key }) =>
          ruleKeys.includes(rule_key),
        ),
      ),
    [instancesQuery.instances],
  );

  // Every critical or warning instance is loaded, so matches can be counted.
  const isListComplete =
    !instancesQuery.isGettingInstances &&
    (instancesQuery.instancesCount ?? 0) <= FETCH_LIMIT;

  const cards = useMemo(
    () =>
      CARDS.map((spec) => {
        const ruleCounts = getRuleCounts(detractors, spec.affectedRuleKeys);
        const largest = Math.max(0, ...ruleCounts);
        if (ruleCounts.length <= 1) {
          return { spec, count: largest, isLowerBound: false };
        }
        // The loaded list can only be trusted when it holds every candidate
        // and agrees with the per-rule counts.
        const matched = isListComplete
          ? instancesForRuleKeys(spec.affectedRuleKeys).length
          : 0;
        return matched >= largest
          ? { spec, count: matched, isLowerBound: false }
          : { spec, count: largest, isLowerBound: true };
      }),
    [detractors, instancesForRuleKeys, isListComplete],
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

  const hasAnyWork = cards.some(({ count }) => count > 0);

  if (detractorsQuery.isLoading || summaryQuery.isLoading) {
    return (
      <Card className={fullWidthClassName}>
        <Card.Content>
          <LoadingState />
        </Card.Content>
      </Card>
    );
  }

  if (!hasAnyWork && detractorsQuery.isSuccess) {
    return (
      <Card className={fullWidthClassName}>
        <Card.Content>
          <p className={classes.description}>Fleet is fully remediated.</p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      {cards.map(({ spec, count, isLowerBound }) => {
        const isRefresh = spec.action === "refresh-facts";
        const isRunning =
          (isRefresh && pendingRefreshIds !== null) ||
          modalAction === spec.action;
        const hasWork = count > 0;
        return (
          <Card key={spec.action} className={className}>
            <Card.Header className={classes.header}>
              <span
                className={classNames(
                  classes.icon,
                  hasWork ? spec.criticality : "success",
                )}
                aria-hidden="true"
              >
                <Icon icon={hasWork ? spec.icon : "success"} />
              </span>
              <h2 className="p-heading--5 u-no-margin u-no-padding">
                {spec.title}
              </h2>
            </Card.Header>
            <Card.Content>
              {hasWork ? (
                <p className={classes.stat}>
                  <span
                    className={classes.value}
                    title={isLowerBound ? `At least ${count}` : undefined}
                  >
                    {count.toLocaleString()}
                    {isLowerBound ? "+" : null}
                  </span>
                  <span className={classes.label}>
                    {pluralize(count, ["instance"])} affected
                  </span>
                </p>
              ) : null}
              <p className={classes.description}>
                {hasWork ? spec.subtitle : spec.emptyCopy}
              </p>
              {spec.action === "run-security-updates" &&
              kernelWaivedCount > 0 ? (
                <Chip
                  className={classes.chip}
                  appearance="information"
                  lead="Livepatch"
                  value={`${kernelWaivedCount} kernel ${pluralize(kernelWaivedCount, ["USN"])} waived`}
                  isDense
                  isReadOnly
                />
              ) : null}
            </Card.Content>
            <Card.Footer>
              <Button
                type="button"
                className="u-no-margin--bottom"
                appearance={isRefresh ? "default" : "positive"}
                disabled={
                  !hasWork || instancesQuery.isGettingInstances || isRunning
                }
                onClick={() => {
                  void onCardClick(spec);
                }}
              >
                {isRunning ? "Working…" : spec.actionLabel}
              </Button>
            </Card.Footer>
          </Card>
        );
      })}
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
