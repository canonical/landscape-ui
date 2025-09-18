import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { Role } from "@/types/Role";
import { pluralize } from "@/utils/_helpers";
import { ConfirmationModal } from "@canonical/react-components";
import { Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import EditRoleForm from "../EditRoleForm";

interface RoleListActionsProps {
  readonly role: Role;
}

const RoleListActions: FC<RoleListActionsProps> = ({ role }) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();

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
    setSidePanelContent(
      `Edit "${role.name}" role`,
      <Suspense fallback={<LoadingState />}>
        <EditRoleForm role={role} />
      </Suspense>,
    );
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
            <span>{`This will remove '${role.name}' role.`}</span>

            {role.persons.length > 0 && (
              <>
                <br />
                <strong>
                  {`This will affect ${role.persons.length} ${pluralize(role.persons.length, "administrator")}.`}
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
