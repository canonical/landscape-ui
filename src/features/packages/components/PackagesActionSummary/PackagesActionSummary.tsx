import type { FC } from "react";
import type {
  PackageChangePlanAction,
  PackageChangePlanActionType,
} from "../../types";
import {
  type GetPackageChangePlanSummaryResponse,
  useDeletePackageChangePlan,
  useExecutePackageChangePlan,
  useGetPackageChangePlanSummary,
} from "../../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import { getSelectionLabel, pluralize } from "@/utils/_helpers";
import LoadingState from "@/components/layout/LoadingState";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import PackagesActionSummaryCount from "./components/PackagesActionSummaryCount";
import { mapActionTypeToPast } from "../../helpers";
import {
  getActionSubmitButtonAppearance,
  getActionSubmitButtonText,
} from "./helpers";
import classes from "./PackagesActionSummary.module.scss";
import classNames from "classnames";
import { Icon } from "@canonical/react-components";
import PackageActionExclusionsCount from "./components/PackagesActionExclusionsCount";

interface PackagesActionSummaryProps {
  readonly actionType: Exclude<PackageChangePlanActionType, "upgrade">;
  readonly packageChangePlanId: number;
  readonly onBackButtonPress: () => void;
}

const PackagesActionSummary: FC<PackagesActionSummaryProps> = ({
  actionType,
  packageChangePlanId,
  onBackButtonPress,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { closeSidePanel } = useSidePanel();

  const {
    data: summaryResponse,
    error: summaryError,
    isPending: isGettingSummary,
  } = useGetPackageChangePlanSummary<typeof actionType>(packageChangePlanId);

  const { mutateAsync: executeChangePlan, isPending: isExecutingChangePlan } =
    useExecutePackageChangePlan();
  const { mutateAsync: deleteChangePlan } = useDeletePackageChangePlan();

  if (summaryError) {
    throw summaryError;
  }

  if (isGettingSummary) {
    return <LoadingState />;
  }

  const items = summaryResponse.data.actions;
  const actionPast = mapActionTypeToPast(actionType);

  const submit = async () => {
    try {
      const { data: activity } = await executeChangePlan(packageChangePlanId);

      closeSidePanel();

      notify.success({
        title: `You queued ${getSelectionLabel(
          items,
          (item) => {
            switch (item.action.type) {
              case "install":
              case "remove":
              case "hold":
              case "unhold":
                return `${item.action.package.name} to be ${actionPast}`;
              case "change_version":
                return `${item.action.to_package.name} to be changed to version ${item.action.to_package.version}`;
            }
          },
          `packages to be ${actionPast}`,
        )}.`,
        message: `${getSelectionLabel(
          items,
          (item) => {
            switch (item.action.type) {
              case "install":
              case "remove":
              case "hold":
              case "unhold":
                return `${item.action.package.name} will be ${actionPast}`;
              case "change_version":
                return `${item.action.to_package.name} will be changed to version ${item.action.to_package.version}`;
            }
          },
          `selected packages will be ${actionPast}`,
        )} and ${pluralize(items.length, ["is", "are"])} queued in Activities.`,
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

  const getPackageName = (
    action: PackageChangePlanAction<typeof actionType>,
  ) => {
    switch (action.type) {
      case "install":
      case "remove":
      case "hold":
      case "unhold":
        return action.package.name;
      case "change_version":
        return action.to_package.name;
    }
  };

  const packagesByName = items.reduce<Record<string, typeof items>>(
    (acc, item) => {
      const packageName = getPackageName(item.action);
      const packageByName = acc[packageName];

      if (packageByName) {
        packageByName.push(item);
      } else {
        acc[packageName] = [item];
      }

      return acc;
    },
    {},
  );

  const goBack = () => {
    deleteChangePlan(packageChangePlanId);
    onBackButtonPress();
  };

  const cancel = () => {
    deleteChangePlan(packageChangePlanId);
    closeSidePanel();
  };

  const getKey = (action: PackageChangePlanAction<typeof actionType>) => {
    switch (action.type) {
      case "install":
      case "remove":
      case "hold":
      case "unhold":
        return `${action.type}-${action.package.id}`;
      case "change_version":
        return `${action.type}-${action.from_package.id}-${action.to_package.id}`;
    }
  };

  const getRow = (
    item: GetPackageChangePlanSummaryResponse<
      typeof actionType
    >["actions"][number],
  ) => {
    switch (item.action.type) {
      case "install":
      case "remove":
      case "hold":
      case "unhold":
        return (
          <>
            <span className={classNames("font-monospace", classes.name)}>
              {item.action.package.version}
            </span>{" "}
            will be {mapActionTypeToPast(actionType)} on{" "}
            <PackagesActionSummaryCount
              count={item.computer_count}
              id={packageChangePlanId}
              action={item.action}
            />
          </>
        );
      case "change_version":
        return (
          <>
            <span className={classNames("font-monospace", classes.name)}>
              {item.action.from_package.version}
            </span>{" "}
            <Icon name="arrow-right--muted" />{" "}
            <span className={classNames("font-monospace", classes.name)}>
              {item.action.to_package.version}
            </span>{" "}
            on{" "}
            <PackagesActionSummaryCount
              count={item.computer_count}
              id={packageChangePlanId}
              action={item.action}
            />
          </>
        );
    }
  };

  return (
    <>
      <ul className={classNames("p-list", "u-no-margin--bottom", classes.list)}>
        {Object.entries(packagesByName).map(([packageName, items]) => {
          const exclusion = summaryResponse.data.exclusions.find(
            ({ package_name }) => package_name === packageName,
          );

          return (
            <li key={packageName}>
              <div>
                <strong className={classNames("font-monospace", classes.name)}>
                  {packageName}
                </strong>
              </div>
              {items.map((item) => {
                return (
                  <div key={getKey(item.action)} className={classes.row}>
                    {getRow(item)}
                  </div>
                );
              })}
              {!!exclusion?.computer_count && (
                <div className={classes.row}>
                  Will not be {mapActionTypeToPast(actionType)} on{" "}
                  <PackageActionExclusionsCount
                    count={exclusion.computer_count}
                    id={packageChangePlanId}
                    packageName={exclusion.package_name}
                    actionType={actionType}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <SidePanelFormButtons
        submitButtonLoading={isExecutingChangePlan}
        submitButtonText={`${getActionSubmitButtonText(actionType)} ${pluralize(
          items.length,
          ["package"],
          "exact",
        )}`}
        submitButtonAppearance={getActionSubmitButtonAppearance(actionType)}
        onSubmit={submit}
        hasBackButton
        onBackButtonPress={goBack}
        onCancel={cancel}
      />
    </>
  );
};

export default PackagesActionSummary;
