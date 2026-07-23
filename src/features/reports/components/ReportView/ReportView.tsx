import LoadingState from "@/components/layout/LoadingState";
import {
  CONTACT_SUPPORT_TEAM_MESSAGE,
  DISPLAY_DATE_TIME_FORMAT,
} from "@/constants";
import {
  getSelectedInstanceIds,
  subscribeToSelectedInstanceIds,
} from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import SidePanel from "@/components/layout/SidePanel";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useState, useSyncExternalStore } from "react";
import { useGetComplianceReport } from "../../api";
import type { DonutSegment } from "../ReportDonutChart";
import ReportDonutChart from "../ReportDonutChart";
import ReportExportForm from "../ReportExportForm";
import type { BucketKey } from "../ReportExportForm/constants";
import type { MetricRow } from "../MetricBarTable";
import MetricBarTable from "../MetricBarTable";
import classes from "./ReportView.module.scss";

interface ReportViewProps {
  readonly selectedInstanceIds?: number[];
  readonly isAllSelected?: boolean;
  readonly allSelectedQuery?: string;
}

const ReportView: FC<ReportViewProps> = ({
  selectedInstanceIds,
  isAllSelected,
  allSelectedQuery,
}) => {
  const { closeSidePanel, createSidePathPusher, lastSidePathSegment } =
    usePageParams();
  const handleExport = createSidePathPusher("export");

  // The report is a snapshot of the selection at the time the panel was
  // opened (or last regenerated); the live selection is only observed to
  // tell the user when the snapshot has gone stale.
  const currentIds = useSyncExternalStore(
    subscribeToSelectedInstanceIds,
    getSelectedInstanceIds,
  );
  // Initialize snapshot from props (frozen at open time) or fall back to current
  const initialIds = isAllSelected
    ? currentIds // When all selected, use full current IDs from store
    : (selectedInstanceIds ?? currentIds);
  const [reportIds, setReportIds] = useState<readonly number[]>(initialIds);
  const reportIdSet = new Set(reportIds);
  const selectionChanged =
    !isAllSelected &&
    (currentIds.length !== reportIds.length ||
      !currentIds.every((id) => reportIdSet.has(id)));

  let query = "";
  if (isAllSelected) {
    query = allSelectedQuery ?? "";
  } else if (reportIds.length > 0) {
    query = `id:${reportIds.join(" OR id:")}`;
  }
  const { report, isGettingComplianceReport, isComplianceReportError } =
    useGetComplianceReport({
      query,
    });

  const regenerateReport = () => {
    setReportIds(currentIds);
  };

  // A shareable deep link to the instances list filtered to exactly these
  // instances. We filter by id (not by a semantic term) so the result matches
  // the report's selection-scoped count exactly.
  const instancesHref = (ids: readonly number[]): string | undefined =>
    ids.length > 0
      ? ROUTES.instances.root({ query: `id:${ids.join(" OR id:")}` })
      : undefined;

  if (isGettingComplianceReport) {
    return <LoadingState />;
  }

  if (isComplianceReportError || !report) {
    return (
      <Notification severity="negative" title="Error">
        {CONTACT_SUPPORT_TEAM_MESSAGE}
      </Notification>
    );
  }

  const { total } = report;

  // Every instance lands in exactly one bucket, worst first: instances with
  // USNs outstanding for over 60 days take priority, the rest are split by the
  // longest time they took to apply a USN (the fixed_in buckets are
  // cumulative). Whatever the server cannot place in a named interval — USNs
  // still unpatched for under 60 days, or patched after more than 60 days — is
  // reported honestly as "Other". We carry the exact computer ids per bucket so
  // the deep link matches the report's count precisely.
  const pendingIds = report.usn_pending_over_60_days.computer_ids;
  const withinTwoIds = report.usn_fixed_in["2"].computer_ids;
  const withinFourteenIds = report.usn_fixed_in["14"].computer_ids;
  const withinThirtyIds = report.usn_fixed_in["30"].computer_ids;
  const withinSixtyIds = report.usn_fixed_in["60"].computer_ids;
  const pendingSet = new Set(pendingIds);
  const withinTwoSet = new Set(withinTwoIds);
  const withinFourteenSet = new Set(withinFourteenIds);
  const withinThirtySet = new Set(withinThirtyIds);

  const sixtyPlusIds = pendingIds;
  const withinTwoBucket = withinTwoIds.filter((id) => !pendingSet.has(id));
  const twoToFourteenIds = withinFourteenIds.filter(
    (id) => !withinTwoSet.has(id) && !pendingSet.has(id),
  );
  const fourteenToThirtyIds = withinThirtyIds.filter(
    (id) => !withinFourteenSet.has(id) && !pendingSet.has(id),
  );
  const thirtyToSixtyIds = withinSixtyIds.filter(
    (id) => !withinThirtySet.has(id) && !pendingSet.has(id),
  );
  const classified = new Set([
    ...sixtyPlusIds,
    ...withinTwoBucket,
    ...twoToFourteenIds,
    ...fourteenToThirtyIds,
    ...thirtyToSixtyIds,
  ]);

  const bucketIds: Record<BucketKey, readonly number[]> = {
    "over-60": sixtyPlusIds,
    "30-60": thirtyToSixtyIds,
    "14-30": fourteenToThirtyIds,
    "2-14": twoToFourteenIds,
    "within-2": withinTwoBucket,
  };
  // "Other" is the accounted instances not in any named bucket. Derive the
  // universe from the report's own id sets (every accounted instance appears
  // in securely/not-securely-patched and/or the USN sets) rather than from the
  // raw selection, which may include instances the server didn't account for.
  const accountedIds = new Set<number>([
    ...report.securely_patched.computer_ids,
    ...report.not_securely_patched.computer_ids,
    ...withinSixtyIds,
    ...pendingIds,
  ]);
  const otherIds = [...accountedIds].filter((id) => !classified.has(id));
  const OTHER_DETAIL =
    "Instances with a USN outstanding for under 60 days, or that last applied a USN more than 60 days ago.";

  const segmentDefs: {
    key: string;
    label: string;
    ids: readonly number[];
    color: DonutSegment["color"];
    detail?: string;
  }[] = [
    {
      key: "over-60",
      label: "60+ days outstanding",
      ids: sixtyPlusIds,
      color: "red",
    },
    {
      key: "30-60",
      label: "30–60 days",
      ids: thirtyToSixtyIds,
      color: "orange",
    },
    {
      key: "14-30",
      label: "14–30 days",
      ids: fourteenToThirtyIds,
      color: "orangeLight",
    },
    {
      key: "2-14",
      label: "2–14 days",
      ids: twoToFourteenIds,
      color: "greenLight",
    },
    {
      key: "within-2",
      label: "Within 2 days",
      ids: withinTwoBucket,
      color: "green",
    },
    {
      key: "other",
      label: "Other",
      ids: otherIds,
      color: "grey",
      detail: OTHER_DETAIL,
    },
  ];

  const patchSegments: DonutSegment[] = segmentDefs.map((segment) => ({
    key: segment.key,
    label: segment.label,
    detail: segment.detail,
    count: segment.ids.length,
    color: segment.color,
    countHref: instancesHref(segment.ids),
    onCountActivate: closeSidePanel,
    countAriaLabel: `View the ${segment.ids.length} instances in the ${segment.label} bucket`,
  }));

  const statusRows: MetricRow[] = [
    {
      key: "securely-patched",
      label: "Securely patched",
      count: report.securely_patched.count,
      total,
      color: "positive",
      countHref: instancesHref(report.securely_patched.computer_ids),
      onCountActivate: closeSidePanel,
      countAriaLabel: `View the ${report.securely_patched.count} securely patched instances`,
    },
    {
      key: "upgrade-profiles",
      label: "Upgrade profiles",
      count: report.covered_by_upgrade_profiles.count,
      total,
      color: "link",
      countHref: instancesHref(report.covered_by_upgrade_profiles.computer_ids),
      onCountActivate: closeSidePanel,
      countAriaLabel: `View the ${report.covered_by_upgrade_profiles.count} instances covered by upgrade profiles`,
    },
    {
      key: "contacted",
      label: "Contacted in last 5 min",
      count: report.contacted_recently.count,
      total,
      color: "neutral",
      countHref: instancesHref(report.contacted_recently.computer_ids),
      onCountActivate: closeSidePanel,
      countAriaLabel: `View the ${report.contacted_recently.count} instances contacted in the last 5 minutes`,
    },
  ];

  if (lastSidePathSegment === "export") {
    return (
      <>
        <SidePanel.Header>Export report as TSV</SidePanel.Header>
        <SidePanel.Content>
          <ReportExportForm bucketIds={bucketIds} otherIds={otherIds} />
        </SidePanel.Content>
      </>
    );
  }

  return (
    <>
      <SidePanel.Header>
        {`Report for ${pluralize(reportIds.length, ["instance"], "exact")}`}
      </SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            appearance="secondary"
            className="p-segmented-control__button"
            onClick={handleExport}
          >
            <span>Export as TSV</span>
          </Button>
        </div>
        {selectionChanged && (
          <Notification
            severity="information"
            title="Selection has changed"
            actions={
              currentIds.length > 0
                ? [{ label: "Regenerate report", onClick: regenerateReport }]
                : undefined
            }
          >
            {`This report still covers the ${pluralize(reportIds.length, ["instance"], "exact")} selected when it was generated.`}
          </Notification>
        )}
        <section className={classes.section}>
          <p
            className={classNames("p-heading--5 u-no-margin", classes.heading)}
          >
            Status
          </p>
          <MetricBarTable
            labelHeader="Status"
            countHeader="Instances"
            rows={statusRows}
          />
        </section>
        <section className={classes.section}>
          <p
            className={classNames("p-heading--5 u-no-margin", classes.heading)}
          >
            Security upgrades
          </p>
          <ReportDonutChart
            total={total}
            segments={patchSegments}
            labelHeader="Time to patch USNs"
            countHeader="Instances"
          />
        </section>
        <p className="u-text--muted p-text--small">
          {`Report generated ${moment(report.generated_at).format(DISPLAY_DATE_TIME_FORMAT)}`}
        </p>
      </SidePanel.Content>
    </>
  );
};

export default ReportView;
