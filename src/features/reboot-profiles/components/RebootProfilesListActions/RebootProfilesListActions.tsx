import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { RebootProfile } from "../../types";
import RebootProfileRemoveModal from "../RebootProfileRemoveModal";

interface RebootProfilesListActionsProps {
  readonly profile: RebootProfile;
}

const RebootProfilesListActions: FC<RebootProfilesListActionsProps> = ({
  profile,
}) => {
  const { setPageParams } = usePageParams();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleRebootProfileEdit = () => {
    setPageParams({ sidePath: ["edit"], profile: profile.id.toString() });
  };

  const handleRebootProfileDuplicate = () => {
    setPageParams({ sidePath: ["duplicate"], profile: profile.id.toString() });
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleRebootProfileEdit,
    },
    {
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate "${profile.title}" profile`,
      onClick: handleRebootProfileDuplicate,
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

      <RebootProfileRemoveModal
        close={closeModal}
        opened={isModalOpen}
        rebootProfile={profile}
      />
    </>
  );
};

export default RebootProfilesListActions;
