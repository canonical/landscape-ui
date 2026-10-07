import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { boolToLabel } from "@/utils/output";
import { ConfirmationModal, Switch } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useEditStaffAccount, useGetFeatureRegistry } from "../../api";
import type { FeatureRegistryEntry, StaffAccount } from "../../types";
import classes from "./StaffAccountFeatures.module.scss";

const MIN_TABLE_WIDTH = 400;

type FeatureRow = FeatureRegistryEntry & {
  isEnabled: boolean;
  isDisabled: boolean;
};

interface StaffAccountFeaturesProps {
  readonly staffAccount: StaffAccount;
}

const StaffAccountFeatures: FC<StaffAccountFeaturesProps> = ({
  staffAccount,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { canManageAccounts } = useAuth();
  const { featureRegistry, featureRegistryError, isGettingFeatureRegistry } =
    useGetFeatureRegistry();
  const { editStaffAccount, isEditingStaffAccount } = useEditStaffAccount();

  // What a change in flight will leave enabled, shown until the account is refetched.
  const [pendingFeatures, setPendingFeatures] = useState<number[] | null>(null);

  const enabledFeatures = pendingFeatures ?? staffAccount.enabled_features;

  const rows = useMemo<FeatureRow[]>(
    () =>
      featureRegistry.map((feature) => ({
        ...feature,
        isEnabled: enabledFeatures.includes(feature.database_key),
        isDisabled: !canManageAccounts || isEditingStaffAccount,
      })),
    [
      canManageAccounts,
      enabledFeatures,
      featureRegistry,
      isEditingStaffAccount,
    ],
  );

  // The feature whose change is waiting for confirmation, as it was when clicked.
  const [confirmingFeature, setConfirmingFeature] = useState<FeatureRow | null>(
    null,
  );

  const closeConfirmation = () => {
    setConfirmingFeature(null);
  };

  const toggleFeature = async (feature: FeatureRow) => {
    const isEnabling = !feature.isEnabled;

    // The PATCH replaces the whole set and rejects keys that have left the
    // registry, so the set is rebuilt from the registry.
    const nextFeatures = rows
      .filter((row) =>
        row.database_key === feature.database_key ? isEnabling : row.isEnabled,
      )
      .map(({ database_key }) => database_key)
      .sort((a, b) => a - b);

    setPendingFeatures(nextFeatures);

    try {
      await editStaffAccount({
        name: staffAccount.account,
        enabled_features: nextFeatures,
      });

      notify.success({
        title: `${feature.name} ${isEnabling ? "enabled" : "disabled"}`,
        message: `${feature.name} is now ${isEnabling ? "enabled" : "disabled"} for ${staffAccount.company}.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      setPendingFeatures(null);
      closeConfirmation();
    }
  };

  // Row state travels in the data and the state setter is stable, so the cells
  // are never recreated and a toggled switch keeps its place in the document.
  const columns = useMemo<Column<FeatureRow>[]>(
    () => [
      {
        accessor: "name",
        Header: "Feature",
        Cell: ({ row: { original } }: CellProps<FeatureRow>): ReactNode => (
          <>
            <span className={classes.name}>{original.name}</span>
            <span className="u-text--muted p-text--small">
              {original.description}
            </span>
          </>
        ),
      },
      {
        id: "enabled",
        Header: "Enabled",
        className: classes.enabledColumn,
        Cell: ({ row: { original } }: CellProps<FeatureRow>): ReactNode => (
          <div className={classes.switch}>
            <Switch
              aria-label={original.name}
              label={boolToLabel(original.isEnabled)}
              checked={original.isEnabled}
              disabled={original.isDisabled}
              onChange={() => {
                setConfirmingFeature(original);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  if (featureRegistryError) {
    throw featureRegistryError;
  }

  if (isGettingFeatureRegistry) {
    return <LoadingState />;
  }

  const confirmationAction = confirmingFeature?.isEnabled
    ? "Disable"
    : "Enable";

  return (
    <>
      <p className={classNames("u-text--muted", classes.description)}>
        {canManageAccounts
          ? "A change applies to this account as soon as you confirm it."
          : "Only account managers can change feature flags."}
      </p>

      <ResponsiveTable
        columns={columns}
        data={rows}
        emptyMsg="The feature registry is empty."
        minWidth={MIN_TABLE_WIDTH}
      />

      {confirmingFeature && (
        <ConfirmationModal
          title={`${confirmationAction} ${confirmingFeature.name}`}
          confirmButtonLabel={confirmationAction}
          confirmButtonAppearance={
            confirmingFeature.isEnabled ? "negative" : "positive"
          }
          confirmButtonDisabled={isEditingStaffAccount}
          confirmButtonLoading={isEditingStaffAccount}
          onConfirm={async () => toggleFeature(confirmingFeature)}
          close={closeConfirmation}
        >
          <p className="u-margin--bottom">
            This will {confirmationAction.toLowerCase()}{" "}
            <strong>{confirmingFeature.name}</strong> for{" "}
            <strong>{staffAccount.company}</strong> ({staffAccount.account}).
            The change applies to the account immediately.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default StaffAccountFeatures;
