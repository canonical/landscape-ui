import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useReports from "@/hooks/useReports";
import useSidePanel from "@/hooks/useSidePanel";
import ReportForm from "@/pages/dashboard/instances/ReportForm";
import ReportWidget from "@/pages/dashboard/instances/ReportWidget";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Col, Row } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import classes from "./ReportView.module.scss";

interface ReportViewProps {
  readonly instanceIds: number[];
}

const ReportView: FC<ReportViewProps> = ({ instanceIds }) => {
  const { setSidePanelContent } = useSidePanel();
  const { getNotPingingInstances, getInstancesNotUpgraded, getUsnTimeToFix } =
    useReports();

  const {
    data: getNotPingingInstancesResult,
    isLoading: getNotPingingInstancesLoading,
  } = getNotPingingInstances({
    since_minutes: 5,
    query: `id:${instanceIds.join(" OR id:")}`,
  });

  const pingingInstancesCount = getNotPingingInstancesResult
    ? instanceIds.length - getNotPingingInstancesResult.data.length
    : 0;

  const {
    data: getInstancesNotUpgradedResult,
    isLoading: getInstancesNotUpgradedLoading,
  } = getInstancesNotUpgraded({
    query: `id:${instanceIds.join(" OR id:")}`,
  });

  const upgradedInstanceCount = getInstancesNotUpgradedResult
    ? instanceIds.length - getInstancesNotUpgradedResult.data.length
    : 0;

  const { data: getUsnTimeToFixResult, isLoading: getUsnTimeToFixLoading } =
    getUsnTimeToFix({
      query: `id:${instanceIds.join(" OR id:")}`,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      fixed_in_days: [2, 14, 30, 60],
    });

  const securityUpgradesInstanceCount = {
    month: getUsnTimeToFixResult?.data["30"]?.length || 0,
    old: getUsnTimeToFixResult?.data["60"]?.length || 0,
    pending: getUsnTimeToFixResult?.data.pending.length || 0,
    recent: getUsnTimeToFixResult?.data["2"]?.length || 0,
    twoWeeks: getUsnTimeToFixResult?.data["14"]?.length || 0,
  };

  const periodToDays = {
    recent: 2,
    twoWeeks: 14,
    month: 30,
    old: 60,
  };

  const getSecurityUpgradesReportDescription = (
    period: keyof Omit<typeof securityUpgradesInstanceCount, "pending">,
    type: "positive" | "negative",
  ) => {
    const count =
      type === "positive"
        ? securityUpgradesInstanceCount[period]
        : instanceIds.length - securityUpgradesInstanceCount[period];

    return `${pluralizeWithCount(count, "instance has", "instances have")} ${type === "negative" ? " not" : ""} applied USNs in ${periodToDays[period]} days or less.`;
  };

  const handleDownloadDialog = () => {
    setSidePanelContent(
      "Download report as CSV",
      <ReportForm instanceIds={instanceIds} />,
    );
  };

  return (
    <>
      <div className={classes.rowContainer}>
        <Row
          className={classNames(
            "u-no-padding--left u-no-padding--right",
            classes.row,
          )}
        >
          <Col size={6}>
            {!getUsnTimeToFixLoading && (
              <ReportWidget
                currentCount={
                  instanceIds.length - securityUpgradesInstanceCount.pending
                }
                negativeDescription={`${pluralizeWithCount(securityUpgradesInstanceCount.pending, "instance is", "instances are")} not yet patched.`}
                positiveDescription={`${pluralizeWithCount(instanceIds.length - securityUpgradesInstanceCount.pending, "instance is", "instances are")} securely patched.`}
                title="Securely patched"
                totalCount={instanceIds.length}
              />
            )}
          </Col>
          <Col size={6}>
            {!getInstancesNotUpgradedLoading && (
              <ReportWidget
                currentCount={upgradedInstanceCount}
                negativeDescription={`${pluralizeWithCount(Number(getInstancesNotUpgradedResult?.data.length ?? 0), "instance is", "instances are")} not covered by upgrade profiles.`}
                positiveDescription={`${pluralizeWithCount(upgradedInstanceCount, "instance is", "instances are")} covered by upgrade profiles.`}
                title="Upgrade profiles"
                totalCount={instanceIds.length}
              />
            )}
          </Col>
          <Col size={6}>
            {!getNotPingingInstancesLoading && (
              <ReportWidget
                currentCount={pingingInstancesCount}
                negativeDescription={`${pluralizeWithCount(Number(getNotPingingInstancesResult?.data.length ?? 0), "instance has", "instances have")} not contacted the server within the last 5 minutes.`}
                positiveDescription={`${pluralizeWithCount(pingingInstancesCount, "instance has", "instances have")} contacted the server within the last 5 minutes.`}
                title="Contacted"
                totalCount={instanceIds.length}
              />
            )}
          </Col>
        </Row>
      </div>
      {!getUsnTimeToFixLoading && (
        <div className={classes.rowContainer}>
          <h4>Security upgrades</h4>
          <Row
            className={classNames(
              "u-no-padding--left u-no-padding--right",
              classes.row,
            )}
          >
            {Object.entries(periodToDays).map(([key, days]) => {
              const period = key as keyof typeof periodToDays;
              return (
                <Col size={6} key={period}>
                  <ReportWidget
                    currentCount={securityUpgradesInstanceCount[period]}
                    negativeDescription={getSecurityUpgradesReportDescription(
                      period,
                      "negative",
                    )}
                    positiveDescription={getSecurityUpgradesReportDescription(
                      period,
                      "positive",
                    )}
                    title={`${days} days`}
                    totalCount={instanceIds.length}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      <SidePanelFormButtons
        submitButtonDisabled={false}
        submitButtonText="Download as CSV"
        onSubmit={handleDownloadDialog}
      />
    </>
  );
};

export default ReportView;
