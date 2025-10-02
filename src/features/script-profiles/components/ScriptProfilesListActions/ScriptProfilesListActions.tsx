import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";

interface ScriptProfilesListActionsProps {
  readonly scriptProfile: ScriptProfile;
}

const ScriptProfilesListActions: FC<ScriptProfilesListActionsProps> = ({
  scriptProfile,
}) => {
  const { createPageParamsSetter } = usePageParams();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      onClick: createPageParamsSetter({
        sidePath: ["view"],
        profile: scriptProfile.id.toString(),
      }),
    },
  ];

  if (!scriptProfile.archived) {
    nondestructiveActions.push({
      icon: "edit",
      label: "Edit",
      onClick: createPageParamsSetter({
        sidePath: ["edit"],
        profile: scriptProfile.id.toString(),
      }),
    });
  }

  const destructiveActions: Action[] | undefined = !scriptProfile.archived
    ? [
        {
          icon: "archive",
          label: "Archive",
          onClick: openArchiveModal,
        },
      ]
    : undefined;

  return (
    <>
      <ListActions
        toggleAriaLabel={`${scriptProfile.title} script profile actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />
      <ScriptProfileArchiveModal
        onClose={closeArchiveModal}
        opened={archiveModalOpened}
        profile={scriptProfile}
      />
    </>
  );
};

export default ScriptProfilesListActions;
