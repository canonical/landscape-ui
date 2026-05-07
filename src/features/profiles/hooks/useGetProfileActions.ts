import type { Action } from "@/types/Action";
import { ICONS } from "@canonical/react-components";
import {
  isUsgProfile,
  isPackageProfile,
  canDuplicateProfile,
  canArchiveProfile,
  isProfileArchived,
  type ProfileTypes,
} from "../helpers";
import useDebug from "@/hooks/useDebug";
import { useNavigate } from "react-router";
import useNotify from "@/hooks/useNotify";
import { useRunUsgProfile } from "@/features/usg-profiles";
import { ROUTES } from "@/libs/routes";
import { useOpenProfileSidePanel } from "./useOpenProfileSidePanel";
import type { USGProfileMode } from "@/features/usg-profiles";
import useProfiles from "@/hooks/useProfiles";
import type { Profile } from "../types";
import usePageParams from "@/hooks/usePageParams/usePageParams";

interface UseGetProfileActionsProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
  readonly openModal: () => void;
}

export const useGetProfileActions = ({
  profile,
  type,
  openModal,
}: UseGetProfileActionsProps) => {
  const openProfileSidePanel = useOpenProfileSidePanel();
  const { runUsgProfile } = useRunUsgProfile();
  const { isProfileLimitReached } = useProfiles();
  const { closeSidePanel } = usePageParams();
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();

  const getNotificationMessage = (mode: USGProfileMode) => {
    switch (mode) {
      case "audit-fix-restart":
        return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
      case "audit":
        return "Generating an audit has been queued in Activities.";
      default:
        return "Applying remediation fixes and generating an audit have been queued in Activities.";
    }
  };

  const handleRunUsgProfile = async (mode: USGProfileMode) => {
    try {
      const { data: activity } = await runUsgProfile({ id: profile.id });

      closeSidePanel();

      const message = getNotificationMessage(mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} USG profile`,
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

  const view: Action = {
    icon: "show",
    label: "View details",
    "aria-label": `View ${profile.title} ${type} profile details`,
    onClick: () => {
      openProfileSidePanel(profile, "view");
    },
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} ${type} profile`,
      onClick: () => {
        openProfileSidePanel(profile, "edit");
      },
    },
  ];

  if (isPackageProfile(profile)) {
    actions.push({
      icon: "edit",
      label: "Edit package constraints",
      "aria-label": `Edit ${profile.title} profile package constraints`,
      onClick: () => {
        openProfileSidePanel(profile, "edit-constraints");
      },
    });
  }

  if (isUsgProfile(profile)) {
    actions.push(
      {
        icon: "begin-downloading",
        label: "Download audit",
        "aria-label": `Download ${profile.title} USG profile audit`,
        onClick: () => {
          openProfileSidePanel(profile, "download");
        },
      },
      {
        icon: "play",
        label: "Run",
        "aria-label": `Run ${profile.title} USG profile`,
        onClick: async () => {
          if (!profile.mode.includes("fix")) {
            await handleRunUsgProfile(profile.mode);
            return;
          }
          openProfileSidePanel(profile, "run");
        },
        disabled: !profile.associated_instances,
      },
    );
  }

  if (canDuplicateProfile(profile)) {
    actions.push({
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate ${profile.title} ${type} profile`,
      onClick: () => {
        openProfileSidePanel(profile, "duplicate");
      },
      disabled: isProfileLimitReached,
    });
  }

  if (isProfileArchived(profile)) {
    const filteredActions = actions.filter(
      ({ label }) => label !== "Edit" && label !== "Run",
    );

    return {
      viewAction: view,
      actions: filteredActions,
    };
  }

  const remove: Action = canArchiveProfile(type)
    ? {
        icon: "archive",
        label: "Archive",
        "aria-label": `Archive ${profile.title} ${type} profile`,
        onClick: openModal,
        appearance: "negative",
      }
    : {
        icon: ICONS.delete,
        label: "Remove",
        "aria-label": `Remove ${profile.title} ${type} profile`,
        onClick: openModal,
        appearance: "negative",
      };

  return {
    viewAction: view,
    actions: actions,
    destructiveActions: [remove],
  };
};
