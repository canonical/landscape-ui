import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { AccessGroupWithInstancesCount } from "../../types";
import useNotify from "@/hooks/useNotify";
import useInstances from "@/hooks/useInstances";
import { pluralize } from "@/utils/_helpers";

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
  const { getInstancesQuery } = useInstances();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { data: getInstancesQueryResult } = getInstancesQuery({
    query: `access-group: ${accessGroup.name}`,
    root_only: false,
    with_alerts: true,
    with_upgrades: true,
    limit: 1,
  });

  const count = getInstancesQueryResult?.data.count || 0;

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
          {count > 0 && (
            <p>
              Removing this access group will affect {count}{" "}
              {pluralize(count, "instance")}. They will now belong to &quot;
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
