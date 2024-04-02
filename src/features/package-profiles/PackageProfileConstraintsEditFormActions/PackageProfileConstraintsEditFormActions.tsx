import { FormikContextType } from "formik";
import { FC, lazy, Suspense } from "react";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import { Constraint, PackageProfile } from "@/features/package-profiles/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";

const PackageProfileConstraintsAddForm = lazy(
  () => import("@/features/package-profiles/PackageProfileConstraintsAddForm"),
);

interface PackageProfileConstraintsEditFormActionsProps {
  formik: FormikContextType<Constraint>;
  profile: PackageProfile;
  selectedIds: number[];
  setSelectedIds: (value: number[]) => void;
}

const PackageProfileConstraintsEditFormActions: FC<
  PackageProfileConstraintsEditFormActionsProps
> = ({ formik, profile, selectedIds, setSelectedIds }) => {
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
    <div className="u-align-text--right">
      <Button
        type="button"
        hasIcon
        onClick={handleConstraintsAdd}
        aria-label="Add new constraint"
      >
        <Icon name="plus" />
        <span>Add constraints</span>
      </Button>
      <Button
        type="button"
        hasIcon
        disabled={selectedIds.length === 0 || formik.values.id !== 0}
        onClick={handleConstraintsRemoveDialog}
        aria-label={`Remove selected ${selectedIds.length > 1 ? "constraints" : "constraint"}`}
      >
        <Icon name="delete" />
        <span>Remove</span>
      </Button>
    </div>
  );
};

export default PackageProfileConstraintsEditFormActions;
