import ListActions from "@/components/layout/ListActions";
import { useIsSecurityProfilesLimitReached } from "@/features/security-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { type FC } from "react";
import { useNavigate } from "react-router";
import { useBoolean } from "usehooks-ts";
import { useRunSecurityProfile } from "../../api";
import { getNotificationMessage } from "../../helpers";
import type { SecurityProfile } from "../../types";
import SecurityProfileArchiveModal from "../SecurityProfileArchiveModal";

interface SecurityProfileListActionsProps {
  readonly profile: SecurityProfile;
}

const SecurityProfileListActions: FC<SecurityProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const profileLimitReached = useIsSecurityProfilesLimitReached();
  const { runSecurityProfile } = useRunSecurityProfile();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  const handleRunSecurityProfile = async () => {
    try {
      const { data: activity } = await runSecurityProfile({ id: profile.id });

      setPageParams({ action: "", securityProfile: -1 });

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} security profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              navigate(`/activities?query=parent-id%3A${activity.id}`);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View "${profile.title}" security profile details`,
      onClick: () => {
        setPageParams({ action: "view", securityProfile: profile.id });
      },
    },
    {
      icon: "file-blank",
      label: "Download audit",
      "aria-label": `Download "${profile.title}" security profile audit`,
      onClick: () => {
        setPageParams({ action: "download", securityProfile: profile.id });
      },
    },
  ];

  if (profile.status !== "archived") {
    nondestructiveActions.push(
      {
        icon: "edit",
        label: "Edit",
        "aria-label": `Edit "${profile.title}" security profile`,
        onClick: () => {
          setPageParams({ action: "edit", securityProfile: profile.id });
        },
      },
      {
        icon: "play",
        label: "Run",
        "aria-label": `Run "${profile.title}" security profile`,
        onClick: async () => {
          if (!profile.mode.includes("fix")) {
            await handleRunSecurityProfile();
            return;
          }

          setPageParams({ action: "run", securityProfile: profile.id });
        },
        disabled: !profile.associated_instances,
      },
    );
  }

  nondestructiveActions.push({
    icon: "canvas",
    label: "Duplicate profile",
    "aria-label": `Duplicate "${profile.title}" security profile`,
    onClick: () => {
      setPageParams({ action: "duplicate", securityProfile: profile.id });
    },
    disabled: profileLimitReached,
  });

  const destructiveActions: Action[] | undefined =
    profile.status !== "archived"
      ? [
          {
            icon: "archive",
            label: "Archive",
            "aria-label": `Archive "${profile.title}" security profile`,
            onClick: openArchiveModal,
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

      <SecurityProfileArchiveModal
        close={closeArchiveModal}
        opened={archiveModalOpened}
        profile={profile}
      />
    </>
  );
};

export default SecurityProfileListActions;
