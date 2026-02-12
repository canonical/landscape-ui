import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { Profile, ProfileType } from "../../types";
import RemoveProfileModal from "../RemoveProfileModal";
import { canArchiveProfile, canDuplicateProfile } from "../../helpers";

interface PackageProfileListActionsProps {
  readonly profile: Profile;
  readonly type: ProfileType;
  readonly extraActions: Action[];
}

const ProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
  type,
  extraActions,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const canArchive = canArchiveProfile(type);
  const canDuplicate = canDuplicateProfile(type);

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleProfileEdit = createPageParamsSetter({
    sidePath: ["edit"],
    profile: profile.name,
  });

  const handleProfileDuplicate = createPageParamsSetter({
    sidePath: ["duplicate"],
    profile: profile.name,
  });

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} ${type} profile`,
      onClick: handleProfileEdit,
    },
    ...extraActions,
  ];

  if (canDuplicate) {
    actions.push({
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate ${profile.title} ${type} profile`,
      onClick: handleProfileDuplicate,
    });
  }

  const remove: Action[] = canArchive
    ? [
        {
          icon: "archive",
          label: "Archive",
          "aria-label": `Archive ${profile.title} ${type} profile`,
          onClick: openModal,
        },
      ]
    : [
        {
          icon: "delete",
          label: "Remove",
          "aria-label": `Remove ${profile.title} ${type} profile`,
          onClick: openModal,
        },
      ];
  const destructiveActions = profile.status == "archived" ? remove : undefined;

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
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
