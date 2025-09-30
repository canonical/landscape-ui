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
import { ROUTES } from "@/libs/routes";

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

      setPageParams({ sidePath: [], profile: "" });

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} security profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              navigate(
                ROUTES.activities.root({
                  query: `parent-id:${activity.id}`,
                }),
              );
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
        setPageParams({ sidePath: ["view"], profile: profile.id.toString() });
      },
    },
    {
      icon: "file-blank",
      label: "Download audit",
      "aria-label": `Download "${profile.title}" security profile audit`,
      onClick: () => {
        setPageParams({
          sidePath: ["download"],
          profile: profile.id.toString(),
        });
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
          setPageParams({ sidePath: ["edit"], profile: profile.id.toString() });
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

          setPageParams({ sidePath: ["run"], profile: profile.id.toString() });
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
      setPageParams({
        sidePath: ["duplicate"],
        profile: profile.id.toString(),
      });
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
