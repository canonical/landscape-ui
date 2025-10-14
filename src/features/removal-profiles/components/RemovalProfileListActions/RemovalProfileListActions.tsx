import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { RemovalProfile } from "../../types";
import RemovalProfileRemoveModal from "../RemovalProfileRemoveModal";

interface RemovalProfileListActionsProps {
  readonly profile: RemovalProfile;
}

const RemovalProfileListActions: FC<RemovalProfileListActionsProps> = ({
  profile,
}) => {
  const { createPageParamsSetter } = usePageParams();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleRemovalProfileEdit = createPageParamsSetter({
    sidePath: ["edit"],
    profile: profile.id.toString(),
  });

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleRemovalProfileEdit,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${profile.title}" profile`,
      onClick: openModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <RemovalProfileRemoveModal
        close={closeModal}
        isOpen={isModalOpen}
        removalProfile={profile}
      />
    </>
  );
};

export default RemovalProfileListActions;
