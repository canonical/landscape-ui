import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import usePageParams from "@/hooks/usePageParams";
import type { Role } from "@/types/Role";
import { pluralizeWithCount } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";

interface RoleListActionsProps {
  readonly role: Role;
}

const RoleListActions: FC<RoleListActionsProps> = ({ role }) => {
  const debug = useDebug();
  const { setPageParams, sidePath } = usePageParams();

  const { removeRoleQuery } = useRoles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: remove, isPending: isRemoving } = removeRoleQuery;

  const tryRemove = async () => {
    try {
      await remove({ name: role.name });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const edit = () => {
    setPageParams({ sidePath: [...sidePath, "edit"], name: role.name });
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${role.name} role actions`}
        actions={[
          {
            icon: "edit",
            label: "Edit",
            "aria-label": `Edit "${role.name}" role`,
            onClick: edit,
          },
        ]}
        destructiveActions={[
          {
            icon: "delete",
            label: "Remove",
            "aria-label": `Remove "${role.name}" role`,
            onClick: openModal,
          },
        ]}
      />

      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title={`Remove '${role.name}' role`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={tryRemove}
        >
          <p>
            <span>This will remove &apos;{role.name}&apos; role.</span>

            {role.persons.length > 0 && (
              <>
                <br />
                <strong>
                  This will affect{" "}
                  {pluralizeWithCount(role.persons.length, "administrator")}.
                </strong>
              </>
            )}
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default RoleListActions;
