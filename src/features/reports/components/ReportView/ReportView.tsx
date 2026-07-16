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
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useState, useSyncExternalStore } from "react";
import { useGetComplianceReport } from "../../api";
import type { DonutSegment } from "../ReportDonutChart";
import ReportDonutChart from "../ReportDonutChart";
import ReportForm from "../ReportForm";
import type { MetricRow } from "../MetricBarTable";
import MetricBarTable from "../MetricBarTable";
import { derivePatchBuckets } from "./helpers";
import classes from "./ReportView.module.scss";

interface ReportViewProps {
  readonly instanceIds: number[];
}

const ReportView: FC<ReportViewProps> = ({ instanceIds }) => {
  const { closeSidePanel, setSidePanelContent, setSidePanelTitle } =
    useSidePanel();

  // The report is a snapshot of the selection at the time the panel was
  // opened (or last regenerated); the live selection is only observed to
  // tell the user when the snapshot has gone stale.
  const [reportIds, setReportIds] = useState<readonly number[]>(instanceIds);
  const currentIds = useSyncExternalStore(
    subscribeToSelectedInstanceIds,
    getSelectedInstanceIds,
  );
  const reportIdSet = new Set(reportIds);
  const selectionChanged =
    currentIds.length !== reportIds.length ||
    !currentIds.every((id) => reportIdSet.has(id));

  const { report, isGettingComplianceReport, isComplianceReportError } =
    useGetComplianceReport({
      query: `id:${reportIds.join(" OR id:")}`,
    });

  const regenerateReport = () => {
    setReportIds(currentIds);
    setSidePanelTitle(
      `Report for ${pluralize(currentIds.length, ["instance"], "exact")}`,
    );
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

  const segmentDefs = derivePatchBuckets(report);

  const patchSegments: DonutSegment[] = segmentDefs.map((segment) => ({
    key: segment.key,
    label: segment.label,
    detail: segment.detail,
    count: segment.ids.length,
    color: segment.color,
    countHref: instancesHref(segment.ids),
    onCountActivate: closeSidePanel,
    countAriaLabel: `View the ${pluralize(segment.ids.length, ["instance"], "exact")} in the ${segment.label} bucket`,
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
      countAriaLabel: `View the ${pluralize(report.securely_patched.count, ["securely patched instance"], "exact")}`,
    },
    {
      key: "upgrade-profiles",
      label: "Upgrade profiles",
      count: report.covered_by_upgrade_profiles.count,
      total,
      color: "link",
      countHref: instancesHref(report.covered_by_upgrade_profiles.computer_ids),
      onCountActivate: closeSidePanel,
      countAriaLabel: `View the ${pluralize(report.covered_by_upgrade_profiles.count, ["instance"], "exact")} covered by upgrade profiles`,
    },
    {
      key: "contacted",
      label: "Contacted in last 5 min",
      count: report.contacted_recently.count,
      total,
      color: "neutral",
      countHref: instancesHref(report.contacted_recently.computer_ids),
      onCountActivate: closeSidePanel,
      countAriaLabel: `View the ${pluralize(report.contacted_recently.count, ["instance"], "exact")} contacted in the last 5 minutes`,
    },
  ];

  const handleDownloadDialog = () => {
    setSidePanelContent(
      "Download report as CSV",
      <ReportForm instanceIds={reportIds} />,
    );
  };

  return (
    <>
      <div className={classes.actions}>
        <Button
          appearance="positive"
          className="u-no-margin--bottom"
          onClick={handleDownloadDialog}
        >
          Download as CSV
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
        <p className={classNames("p-heading--5 u-no-margin", classes.heading)}>
          Status
        </p>
        <MetricBarTable
          labelHeader="Status"
          countHeader="Instances"
          rows={statusRows}
        />
      </section>
      <section className={classes.section}>
        <p className={classNames("p-heading--5 u-no-margin", classes.heading)}>
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
    </>
  );
};

export default ReportView;
