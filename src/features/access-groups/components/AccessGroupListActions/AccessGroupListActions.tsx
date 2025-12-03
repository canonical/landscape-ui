import ListActions from "@/components/layout/ListActions";
import { useGetInstances } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { AccessGroupWithInstancesCount } from "../../types";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

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

  const instancesCountText = `${instancesCount}${" "}${pluralize(instancesCount, "instance")}`;

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
        <TextConfirmationModal
          isOpen={isModalOpen}
          title={`Deleting ${accessGroup.title} access group`}
          confirmButtonLabel="Delete"
          confirmationText={`delete ${accessGroup.title}`}
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={tryRemove}
          close={closeModal}
        >
          {instancesCount > 0 ? (
            <>
              <p>
                Profiles are associated with &quot;{accessGroup.title}&quot;.
                Deleting &quot;{accessGroup.title}
                &quot; will affect {instancesCountText}, and they will belong to
                &quot;{parentAccessGroupTitle}&quot;.
              </p>
              <p>
                Profiles targeting &quot;{parentAccessGroupTitle}&quot; may be
                applied to these {instancesCountText}.
              </p>
            </>
          ) : (
            <p>
              Profiles may be associated with &quot;{accessGroup.title}&quot;.
              Deleting &quot;{accessGroup.title}&quot; will affect profiles
              which target &quot;{accessGroup.title}&quot;, and they will
              instead target &quot;{parentAccessGroupTitle}&quot;.
            </p>
          )}
          <p>
            This action is <b>irreversible</b>
          </p>
        </TextConfirmationModal>
      )}
    </>
  );
};

export default AccessGroupListActions;
