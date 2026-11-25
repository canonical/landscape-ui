import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { ConfirmationModal, Select } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
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

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

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
        message: `${selectedIds.length} "${profile.title}" profile's ${pluralize(selectedIds.length, ["constraint"])} removed successfully`,
        title: `Package profile ${pluralize(selectedIds.length, ["constraint"])} removed`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeRemoveModal();
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

      <Button
        type="button"
        importance="secondary"
        anticipation="destructive"
        icon="delete"
        disabled={selectedIds.length === 0 || formik.values.id !== 0}
        aria-label={`Remove selected ${pluralize(selectedIds.length, ["constraint"])}`}
        onClick={openRemoveModal}
      >
        Remove
      </Button>

      <Button
        type="button"
        importance="secondary"
        icon="plus"
        onClick={handleConstraintsAdd}
        aria-label="Add new constraint"
      >
        Add constraints
      </Button>

      {isRemoveModalOpen && (
        <ConfirmationModal
          renderInPortal
          title={`Remove ${pluralize(selectedIds.length, ["constraint"])}`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          confirmButtonProps={{ type: "button" }}
          onConfirm={handleConstraintsRemove}
          close={closeRemoveModal}
        >
          <p className="u-margin--bottom">
            This will remove{" "}
            {pluralize(selectedIds.length, ["constraint"], "exact")}.
          </p>
        </ConfirmationModal>
      )}
    </div>
  );
};

export default PackageProfileConstraintsEditFormActions;
