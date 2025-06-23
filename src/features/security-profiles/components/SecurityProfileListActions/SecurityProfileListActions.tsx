import ListActions from "@/components/layout/ListActions";
import { useIsSecurityProfilesLimitReached } from "@/features/security-profiles";
import type { Action } from "@/types/Action";
import { type FC } from "react";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";

interface SecurityProfileListActionsProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
}

const SecurityProfileListActions: FC<SecurityProfileListActionsProps> = ({
  actions,
  profile,
}) => {
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View "${profile.title}" security profile details`,
      onClick: actions.viewDetails,
    },
    {
      icon: "file-blank",
      label: "Download audit",
      "aria-label": `Download "${profile.title}" security profile audit`,
      onClick: actions.downloadAudit,
    },
  ];

  if (profile.status !== "archived") {
    nondestructiveActions.push(
      {
        icon: "edit",
        label: "Edit",
        "aria-label": `Edit "${profile.title}" security profile`,
        onClick: actions.edit,
      },
      {
        icon: "play",
        label: "Run",
        "aria-label": `Run "${profile.title}" security profile`,
        onClick: actions.run,
        disabled: !profile.associated_instances,
      },
    );
  }

  nondestructiveActions.push({
    icon: "canvas",
    label: "Duplicate profile",
    "aria-label": `Duplicate "${profile.title}" security profile`,
    onClick: actions.duplicate,
    disabled: profileLimitReached,
  });

  const destructiveActions: Action[] | undefined =
    profile.status !== "archived"
      ? [
          {
            icon: "archive",
            label: "Archive",
            "aria-label": `Archive "${profile.title}" security profile`,
            onClick: actions.archive,
          },
        ]
      : undefined;

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />
    </>
  );
};

export default SecurityProfileListActions;
