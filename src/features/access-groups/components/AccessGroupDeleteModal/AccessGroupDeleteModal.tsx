import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import { useGetInstances } from "@/features/instances";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { AccessGroup } from "../../types";

interface AccessGroupDeleteModalProps {
  readonly accessGroup: AccessGroup;
  readonly opened: boolean;
  readonly close: () => void;
  readonly parentAccessGroupTitle: string;
}

const AccessGroupDeleteModal: FC<AccessGroupDeleteModalProps> = ({
  close,
  opened,
  accessGroup,
  parentAccessGroupTitle,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { removeAccessGroupQuery } = useRoles();
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
      close();
    }
  };

  const { instancesCount = 0 } = useGetInstances({
    query: `access-group:${accessGroup.name}`,
    limit: 1,
  });

  const instancesCountText = `${instancesCount} ${pluralize(instancesCount, "instance")}`;
  const itOrThem = pluralize(instancesCount, "it", "them");
  const thisOrTheseInstances = pluralize(
    instancesCount,
    "this instance",
    "these instances",
  );

  return (
    <TextConfirmationModal
      isOpen={opened}
      title={`Deleting ${accessGroup.title} access group`}
      confirmButtonLabel="Delete"
      confirmationText={`delete ${accessGroup.title}`}
      confirmButtonDisabled={isRemoving}
      confirmButtonLoading={isRemoving}
      onConfirm={tryRemove}
      close={close}
    >
      {instancesCount > 0 ? (
        <p>
          &quot;{accessGroup.title}&quot; is associated with{" "}
          {instancesCountText}. Deleting &quot;{accessGroup.title}&quot; will
          move {itOrThem} to the parent access group, &quot;
          {parentAccessGroupTitle}&quot;. Any profiles associated with &quot;
          {parentAccessGroupTitle}&quot; may be applied to{" "}
          {thisOrTheseInstances}.
        </p>
      ) : (
        <p>
          Profiles may be associated with &quot;{accessGroup.title}&quot;.
          Deleting &quot;{accessGroup.title}&quot; will move any associated
          profiles to its parent group, &quot;{parentAccessGroupTitle}&quot;.
        </p>
      )}
      <p>
        This action is <strong>irreversible</strong>.
      </p>
    </TextConfirmationModal>
  );
};

export default AccessGroupDeleteModal;
