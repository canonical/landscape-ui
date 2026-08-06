import type { FC } from "react";
import type { Package, PackageAction } from "../../types";
import {
  useDeletePackageChangePlan,
  useExecutePackageChangePlan,
  useGetPackageChangePlanSummary,
} from "../../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import { capitalize, getSelectionLabel, pluralize } from "@/utils/_helpers";
import LoadingState from "@/components/layout/LoadingState";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import PackagesActionSummaryCount from "./components/PackagesActionSummaryCount";
import { mapActionToPast } from "../../helpers";
import { getApplicableCount } from "./helpers";
import classes from "./PackagesActionSummary.module.scss";
import classNames from "classnames";

interface PackagesActionSummaryProps {
  readonly action: PackageAction;
  readonly selectedPackages: Package[];
  readonly instanceIds: number[];
  readonly packageChangePlanId: number;
  readonly onBackButtonPress: () => void;
}

const PackagesActionSummary: FC<PackagesActionSummaryProps> = ({
  action,
  packageChangePlanId,
  onBackButtonPress,
  instanceIds,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { closeSidePanel } = useSidePanel();

  const {
    data: summaryResponse,
    error: summaryError,
    isPending: isGettingSummary,
  } = useGetPackageChangePlanSummary(packageChangePlanId);

  const { mutateAsync: executeChangePlan, isPending: isExecutingChangePlan } =
    useExecutePackageChangePlan();
  const { mutateAsync: deleteChangePlan } = useDeletePackageChangePlan();

  if (summaryError) {
    throw summaryError;
  }

  if (isGettingSummary) {
    return <LoadingState />;
  }

  const items = summaryResponse.data.summary_items;
  const actionPast = mapActionToPast(action);

  const submit = async () => {
    try {
      const { data: activity } = await executeChangePlan(packageChangePlanId);

      closeSidePanel();

      notify.success({
        title: `You queued ${getSelectionLabel(items, (item) => `package ${item.package_name}`, "packages")} to be ${actionPast}.`,
        message: `${getSelectionLabel(items, (item) => `${item.package_name}`, "selected packages")} will be ${actionPast} and ${pluralize(items.length, ["is", "are"])} queued in Activities.`,
        actions: [
          {
            label: "Details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const packagesByName = items.reduce<
    Record<string, typeof summaryResponse.data.summary_items>
  >((acc, item) => {
    const name = acc[item.package_name];

    if (name) {
      name.push(item);
    } else {
      acc[item.package_name] = [item];
    }

    return acc;
  }, {});

  const goBack = () => {
    deleteChangePlan(packageChangePlanId);
    onBackButtonPress();
  };

  const cancel = () => {
    deleteChangePlan(packageChangePlanId);
    closeSidePanel();
  };

  return (
    <>
      <ul className={classNames("p-list", "u-no-margin--bottom", classes.list)}>
        {Object.entries(packagesByName).map(
          ([packageName, packageVersions]) => {
            const outOfScope = packageVersions.reduce(
              (previousValue, packageVersion) => {
                return previousValue - getApplicableCount(packageVersion);
              },
              instanceIds.length,
            );

            return (
              <li key={packageName}>
                <div>
                  <strong className="font-monospace">{packageName}</strong>
                </div>
                {packageVersions.map((version) => {
                  return (
                    <div key={version.package_id} className={classes.row}>
                      <span className="font-monospace">
                        {version.package_version}
                      </span>{" "}
                      will be {mapActionToPast(action)} on{" "}
                      <PackagesActionSummaryCount
                        count={getApplicableCount(version)}
                        action={action}
                        packageChangePlanId={packageChangePlanId}
                        packageChangePlanSummaryItem={version}
                      />
                    </div>
                  );
                })}
                {outOfScope > 0 && (
                  <div className={classes.row}>
                    Will not be {mapActionToPast(action)} on{" "}
                    {pluralize(outOfScope, ["instance"], "exact")}
                  </div>
                )}
              </li>
            );
          },
        )}
      </ul>
      <SidePanelFormButtons
        submitButtonLoading={isExecutingChangePlan}
        submitButtonText={`${capitalize(action)} ${pluralize(
          items.length,
          ["package"],
          "exact",
        )}`}
        submitButtonAppearance={action == "install" ? "positive" : "negative"}
        onSubmit={submit}
        hasBackButton
        onBackButtonPress={goBack}
        onCancel={cancel}
      />
    </>
  );
};

export default PackagesActionSummary;
