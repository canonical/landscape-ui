import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
  Select,
} from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import type {
  Constraint,
  PackageProfile,
  PackageProfileConstraintType,
} from "../../types";
import { CONSTRAINT_TYPE_OPTIONS } from "./constants";
import classes from "./PackageProfileConstraintsEditFormActions.module.scss";

interface PackageProfileConstraintsEditFormActionsProps {
  readonly filter: PackageProfileConstraintType | "";
  readonly formik: FormikContextType<Constraint>;
  readonly onFilterChange: (value: PackageProfileConstraintType | "") => void;
  readonly profile: PackageProfile;
  readonly selectedIds: number[];
  readonly setSelectedIds: (value: number[]) => void;
}

const PackageProfileConstraintsEditFormActions: FC<
  PackageProfileConstraintsEditFormActionsProps
> = ({
  filter,
  formik,
  onFilterChange,
  profile,
  selectedIds,
  setSelectedIds,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createSidePathPusher } = usePageParams();
  const { removePackageProfileConstraintsQuery } = usePackageProfiles();

  const { mutateAsync: removeConstraints, isPending: isRemoving } =
    removePackageProfileConstraintsQuery;

  const handleConstraintsRemove = async () => {
    try {
      await removeConstraints({
        constraint_ids: selectedIds,
        name: profile.name,
      });

      setSelectedIds([]);

      notify.success({
        message: `${selectedIds.length} "${profile.title}" profile's ${pluralize(selectedIds.length, "constraint")} removed successfully`,
        title: `Package profile ${pluralize(selectedIds.length, "constraint")} removed`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleConstraintsAdd = createSidePathPusher("add-constraints");

  return (
    <div className={classes.container}>
      <Select
        label="Constraint type"
        className="u-no-margin--bottom"
        labelClassName="u-no-padding--top"
        options={CONSTRAINT_TYPE_OPTIONS}
        value={filter}
        onChange={(event) => {
          onFilterChange(
            event.target.value as PackageProfileConstraintType | "",
          );
        }}
      />

      <ConfirmationButton
        className="has-icon u-no-margin--right u-no-margin--bottom"
        type="button"
        disabled={selectedIds.length === 0 || formik.values.id !== 0}
        aria-label={`Remove selected ${pluralize(selectedIds.length, "constraint")}`}
        confirmationModalProps={{
          title: `Remove ${pluralize(selectedIds.length, "constraint")}`,
          children: (
            <p>
              This will remove {selectedIds.length}{" "}
              {pluralize(selectedIds.length, "constraint")}.
            </p>
          ),
          confirmButtonLabel: "Remove",
          confirmButtonAppearance: "negative",
          confirmButtonDisabled: isRemoving,
          confirmButtonLoading: isRemoving,
          onConfirm: handleConstraintsRemove,
        }}
      >
        <Icon name={ICONS.delete} />
        <span>Remove</span>
      </ConfirmationButton>

      <Button
        className="u-no-margin--bottom"
        type="button"
        hasIcon
        onClick={handleConstraintsAdd}
        aria-label="Add new constraint"
      >
        <Icon name={ICONS.plus} />
        <span>Add constraints</span>
      </Button>
    </div>
  );
};

export default PackageProfileConstraintsEditFormActions;
