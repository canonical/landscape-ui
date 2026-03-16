import ListActions from "@/components/layout/ListActions";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { Profile } from "../../../../types";
import RemoveProfileModal from "../../../RemoveProfileModal";
import { useGetProfileActions } from "../../../../hooks";
import type { ProfileTypes } from "../../../../helpers";

interface PackageProfileListActionsProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

const ProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
  type,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { 
    viewAction,
    actions,
    destructiveActions
  } = useGetProfileActions({ profile, type, openModal });

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={[viewAction, ...actions]}
        destructiveActions={destructiveActions}
      />

      <RemoveProfileModal
        closeModal={closeModal}
        opened={isModalOpen}
        profile={profile}
        type={type}
      />
    </>
  );
};

export default ProfileListActions;
