import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { WslProfile } from "../../types";
import WslProfileRemoveModal from "../WslProfileRemoveModal";

interface WslProfilesListActionsProps {
  readonly profile: WslProfile;
}

const WslProfilesListActions: FC<WslProfilesListActionsProps> = ({
  profile,
}) => {
  const { setPageParams } = usePageParams();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    setPageParams({ sidePath: ["edit"], wslProfile: profile.name });
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} profile`,
      onClick: handleWslProfileEdit,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${profile.title} profile`,
      onClick: openRemoveModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfilesListActions;
