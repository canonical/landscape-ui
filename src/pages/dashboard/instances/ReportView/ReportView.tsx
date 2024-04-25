import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import useReports from "@/hooks/useReports";
import ReportWidget from "@/pages/dashboard/instances/ReportWidget";
import { Col, Row } from "@canonical/react-components";
import classes from "./ReportView.module.scss";
import classNames from "classnames";
import useSidePanel from "@/hooks/useSidePanel";
import ReportForm from "@/pages/dashboard/instances/ReportForm";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";

interface ReportViewProps {
  instanceIds: number[];
}

const ReportView: FC<ReportViewProps> = ({ instanceIds }) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { getNotPingingInstances, getInstancesNotUpgraded, getUsnTimeToFix } =
    useReports();

  const {
    data: getNotPingingInstancesResult,
    isLoading: getNotPingingInstancesLoading,
    error: getNotPingingInstancesError,
  } = getNotPingingInstances({
    since_minutes: 5,
    query: `id:${instanceIds.join(" OR id:")}`,
  });

  if (getNotPingingInstancesError) {
    debug(getNotPingingInstancesError);
  }

  const pingingInstancesCount = getNotPingingInstancesResult
    ? instanceIds.length - getNotPingingInstancesResult.data.length
    : 0;

  const {
    data: getInstancesNotUpgradedResult,
    isLoading: getInstancesNotUpgradedLoading,
    error: getInstancesNotUpgradedError,
  } = getInstancesNotUpgraded({
    query: `id:${instanceIds.join(" OR id:")}`,
  });

  if (getInstancesNotUpgradedError) {
    debug(getInstancesNotUpgradedError);
  }

  const upgradedInstanceCount = getInstancesNotUpgradedResult
    ? instanceIds.length - getInstancesNotUpgradedResult.data.length
    : 0;

  const {
    data: getUsnTimeToFixResult,
    isLoading: getUsnTimeToFixLoading,
    error: getUsnTimeToFixError,
  } = getUsnTimeToFix({
    query: `id:${instanceIds.join(" OR id:")}`,
    fixed_in_days: [2, 14, 30, 60],
  });

  if (getUsnTimeToFixError) {
    debug(getUsnTimeToFixError);
  }

  const securityUpgradesInstanceCount = {
    month: getUsnTimeToFixResult?.data["30"].length || 0,
    old: getUsnTimeToFixResult?.data["60"].length || 0,
    pending: getUsnTimeToFixResult?.data.pending.length || 0,
    recent: getUsnTimeToFixResult?.data["2"].length || 0,
    twoWeeks: getUsnTimeToFixResult?.data["14"].length || 0,
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

    return count !== 1
      ? `${count || "No"} instances have${type === "negative" ? " not" : ""} applied USNs in ${periodToDays[period]} days or less.`
      : `1 instance has${type === "negative" ? " not" : ""} applied USNs in ${periodToDays[period]} days or less.`;
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
                negativeDescription={`${securityUpgradesInstanceCount.pending || "No"} instance${securityUpgradesInstanceCount.pending !== 1 ? "s are" : " is"} not yet patched.`}
                positiveDescription={`${instanceIds.length - securityUpgradesInstanceCount.pending || "No"} instance${instanceIds.length - securityUpgradesInstanceCount.pending !== 1 ? "s are" : " is"} securely patched.`}
                title="Securely patched"
                totalCount={instanceIds.length}
              />
            )}
          </Col>
          <Col size={6}>
            {!getInstancesNotUpgradedLoading && (
              <ReportWidget
                currentCount={upgradedInstanceCount}
                negativeDescription={`${getInstancesNotUpgradedResult?.data.length || "No"} instance${getInstancesNotUpgradedResult?.data.length !== 1 ? "s are" : " is"} not covered by upgrade profiles.`}
                positiveDescription={`${upgradedInstanceCount || "No"} instance${upgradedInstanceCount !== 1 ? "s are" : " is"} covered by upgrade profiles.`}
                title="Upgrade profiles"
                totalCount={instanceIds.length}
              />
            )}
          </Col>
          <Col size={6}>
            {!getNotPingingInstancesLoading && (
              <ReportWidget
                currentCount={pingingInstancesCount}
                negativeDescription={`${getNotPingingInstancesResult?.data.length || "No"} instance${getNotPingingInstancesResult?.data.length !== 1 ? "s have" : " has"} not contacted the server within the last 5 minutes.`}
                positiveDescription={`${pingingInstancesCount || "No"} instance${pingingInstancesCount !== 1 ? "s have" : " has"} contacted the server within the last 5 minutes.`}
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
