import ListActions from "@/components/layout/ListActions";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { AccessGroupWithInstancesCount } from "../../types";
import AccessGroupDeleteModal from "../AccessGroupDeleteModal";

interface AccessGroupListActionsProps {
  readonly accessGroup: AccessGroupWithInstancesCount;
  readonly parentAccessGroupTitle: string;
}

const AccessGroupListActions: FC<AccessGroupListActionsProps> = ({
  accessGroup,
  parentAccessGroupTitle,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

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

      <AccessGroupDeleteModal
        close={closeModal}
        opened={isModalOpen}
        accessGroup={accessGroup}
        parentAccessGroupTitle={parentAccessGroupTitle}
      />
    </>
  );
};

export default AccessGroupListActions;
