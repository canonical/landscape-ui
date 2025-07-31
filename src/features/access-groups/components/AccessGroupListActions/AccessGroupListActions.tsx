import ListActions from "@/components/layout/ListActions";
import { useGetInstances } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { AccessGroupWithInstancesCount } from "../../types";

interface AccessGroupListActionsProps {
  readonly accessGroup: AccessGroupWithInstancesCount;
  readonly parentAccessGroupTitle: string;
}

const AccessGroupListActions: FC<AccessGroupListActionsProps> = ({
  accessGroup,
  parentAccessGroupTitle,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { removeAccessGroupQuery } = useRoles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { instancesCount = 0 } = useGetInstances({
    query: `access-group: ${accessGroup.name}`,
    with_alerts: true,
    with_upgrades: true,
    limit: 1,
  });

  const { mutateAsync: remove, isPending: isRemoving } = removeAccessGroupQuery;

  const tryRemove = async () => {
    try {
      await remove({
        name: accessGroup.name,
      });

      notify.success({
        title: `You have successfully deleted the "${accessGroup.title}" access group.`,
        message: `All entities in this access group will now belong to "${parentAccessGroupTitle}".`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${accessGroup.title} access group actions`}
        destructiveActions={[
          {
            icon: "delete",
            label: "Delete",
            "aria-label": `Delete "${accessGroup.title}" access group`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          title={`Deleting ${accessGroup.title} access group`}
          confirmButtonLabel="Delete"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={tryRemove}
          close={closeModal}
        >
          {instancesCount > 0 && (
            <p>
              Removing this access group will affect {instancesCount}{" "}
              {pluralize(instancesCount, "instance")}. They will now belong to
              &quot;
              {parentAccessGroupTitle}&quot;.
            </p>
          )}
          <p>
            This action is <b>irreversible</b>
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AccessGroupListActions;
