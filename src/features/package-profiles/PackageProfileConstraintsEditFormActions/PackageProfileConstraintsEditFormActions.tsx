import { FormikContextType } from "formik";
import { FC, lazy, Suspense } from "react";
import { Button, Icon, Select } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import {
  Constraint,
  PackageProfile,
  PackageProfileConstraintType,
} from "@/features/package-profiles/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { CONSTRAINT_TYPE_OPTIONS } from "./constants";
import classes from "./PackageProfileConstraintsEditFormActions.module.scss";

const PackageProfileConstraintsAddForm = lazy(
  () => import("@/features/package-profiles/PackageProfileConstraintsAddForm"),
);

interface PackageProfileConstraintsEditFormActionsProps {
  filter: PackageProfileConstraintType | "";
  formik: FormikContextType<Constraint>;
  onFilterChange: (value: PackageProfileConstraintType | "") => void;
  profile: PackageProfile;
  selectedIds: number[];
  setSelectedIds: (value: number[]) => void;
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
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removePackageProfileConstraintsQuery } = usePackageProfiles();

  const { mutateAsync: removeConstraints } =
    removePackageProfileConstraintsQuery;

  const handleConstraintsRemove = async () => {
    try {
      await removeConstraints({
        constraint_ids: selectedIds,
        name: profile.name,
      });

      setSelectedIds([]);

      notify.success({
        message: `${selectedIds.length} "${profile.name}" profile's ${selectedIds.length > 1 ? "constraints" : "constraint"} removed successfully`,
        title: `Package profile ${selectedIds.length > 1 ? "constraints" : "constraint"} removed`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleConstraintsRemoveDialog = () => {
    confirmModal({
      title: `Remove ${selectedIds.length > 1 ? "constraints" : "constraint"}`,
      body: `This will remove ${selectedIds.length} ${selectedIds.length > 1 ? "constraints" : "constraint"}`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleConstraintsRemove()}
          aria-label={`Remove ${selectedIds.length > 1 ? "constraints" : "constraint"}`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleConstraintsAdd = () => {
    setSidePanelContent(
      `Add package constraints to "${profile.name}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsAddForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  return (
    <div className={classes.container}>
      <Select
        label="Constraint type"
        labelClassName="u-no-padding--top"
        options={CONSTRAINT_TYPE_OPTIONS}
        value={filter}
        onChange={(event) =>
          onFilterChange(
            event.target.value as PackageProfileConstraintType | "",
          )
        }
      />

      <Button
        type="button"
        hasIcon
        className="u-no-margin--right"
        disabled={selectedIds.length === 0 || formik.values.id !== 0}
        onClick={handleConstraintsRemoveDialog}
        aria-label={`Remove selected ${selectedIds.length > 1 ? "constraints" : "constraint"}`}
      >
        <Icon name="delete" />
        <span>Remove</span>
      </Button>
      <Button
        type="button"
        hasIcon
        onClick={handleConstraintsAdd}
        aria-label="Add new constraint"
      >
        <Icon name="plus" />
        <span>Add constraints</span>
      </Button>
    </div>
  );
};

export default PackageProfileConstraintsEditFormActions;
