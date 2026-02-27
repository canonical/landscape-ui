import type { Action } from "@/types/Action";
import { ICONS } from "@canonical/react-components";
import { useOpenManageProfileForm } from "./useOpenManageProfileForm";
import { isPackageProfile, isSecurityProfile, canDuplicateProfile, canArchiveProfile, isProfileArchived } from "../helpers";
import type { Profile, ProfileType } from "../types";
import useDebug from "@/hooks/useDebug";
import { useNavigate } from "react-router";
import useNotify from "@/hooks/useNotify";
import { useRunSecurityProfile } from "@/features/security-profiles";
import { ROUTES } from "@/libs/routes";
import usePageParams from "@/hooks/usePageParams/usePageParams";

interface UseGetProfileActionsProps {
  profile: Profile;
  type: ProfileType;
  handleOpenModal: () => void;
}

export const useGetProfileActions = ({ profile, type, handleOpenModal }: UseGetProfileActionsProps) => {
  const { createPageParamsSetter } = usePageParams();
  const openManageProfileForm = useOpenManageProfileForm();
  const { runSecurityProfile } = useRunSecurityProfile();
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();

  const getNotificationMessage = (mode: string) => {
    switch (mode) {
      case "audit-fix-restart":
        return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
      case "audit":
        return "Generating an audit has been queued in Activities.";
      default:
        return "Applying remediation fixes and generating an audit have been queued in Activities.";
    }
  };

  const handleRunSecurityProfile = async (mode: "audit" | "audit-fix" | "audit-fix-restart") => {
    try {
      const { data: activity } = await runSecurityProfile({ id: profile.id });

      createPageParamsSetter({ sidePath: [], profile: "" });

      const message = getNotificationMessage(mode);

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

  const actions: Action[] = [
      {
        icon: "edit",
        label: "Edit",
        "aria-label": `Edit ${profile.title} ${type} profile`,
        onClick: () => { openManageProfileForm({ profile, type, action: "edit" }); },
      },
    ];
  
    if (isPackageProfile(profile)) {
      actions.push({
        icon: "edit",
        label: "Edit package constraints",
        "aria-label": `Edit ${profile.title} profile package constraints`,
        onClick: () => { openManageProfileForm({ profile, type, action: "edit-constraints" }); },
      });
    }
  
    if (isSecurityProfile(profile)) {
      actions.push(
        {
          icon: "file-blank",
          label: "Download audit",
          "aria-label": `Download "${profile.title}" security profile audit`,
          onClick: () => { openManageProfileForm({ profile, type, action: "download" }); },
        },
        {
          icon: "play",
          label: "Run",
          "aria-label": `Run ${profile.title} security profile`,
          onClick: async () => {
              if (profile.mode.includes("fix")) {
                await handleRunSecurityProfile(profile.mode);
                return;
              }
              openManageProfileForm({ profile, type, action: "run" });
            },
            disabled: !profile.associated_instances,
        }
      );
    }
  
    if (canDuplicateProfile(profile)) {
      actions.push({
        icon: "canvas",
        label: "Duplicate",
        "aria-label": `Duplicate ${profile.title} ${type} profile`,
        onClick: () => { openManageProfileForm({ profile, type, action: "duplicate" }); },
      });
    }
  
    const remove: Action = canArchiveProfile(type) ?
      {
        icon: "archive",
        label: "Archive",
        "aria-label": `Archive ${profile.title} ${type} profile`,
        onClick: handleOpenModal,
        appearance: "negative",
      } : {
        icon: ICONS.delete,
        label: "Remove",
        "aria-label": `Remove ${profile.title} ${type} profile`,
        onClick: handleOpenModal,
        appearance: "negative",
      };
    
    if (!isProfileArchived(profile)) {
      actions.push(remove);
    }

    return actions;
};
