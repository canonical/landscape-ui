import { ICONS } from "@canonical/react-components";
import type { Instance } from "@/types/Instance";

interface ActionContext {
  instance: Instance;
  handlers: {
    navigateDetails: () => void;
    viewRecoveryKey: () => void;
    generateRecoveryKey: () => void;
    regenerateRecoveryKey: () => void;
    sanitize: () => void;
    remove: () => void;
  };
}

interface ActionFlags {
  canViewKey: boolean;
  canGenKey: boolean;
  canRegenKey: boolean;
}

export const getInstanceActions = (
  context: ActionContext,
  flags: ActionFlags,
) => {
  const { instance, handlers } = context;

  const primaryConfig = [
    {
      show: true,
      action: {
        icon: "show",
        label: "View details",
        "aria-label": `View ${instance.title} instance details`,
        onClick: handlers.navigateDetails,
      },
    },
    {
      show: flags.canViewKey,
      action: {
        icon: "private-key",
        label: "View recovery key",
        "aria-label": `View ${instance.title} recovery key`,
        onClick: handlers.viewRecoveryKey,
      },
    },
    {
      show: flags.canGenKey,
      action: {
        icon: "plus",
        label: "Generate recovery key",
        "aria-label": `Generate ${instance.title} recovery key`,
        onClick: handlers.generateRecoveryKey,
      },
    },
  ];

  const destructiveConfig = [
    {
      show: flags.canRegenKey,
      action: {
        icon: "restart",
        label: "Regenerate recovery key",
        "aria-label": `Regenerate ${instance.title} recovery key`,
        onClick: handlers.regenerateRecoveryKey,
      },
    },
    {
      show: true,
      action: {
        icon: "tidy",
        label: "Sanitize",
        "aria-label": `Sanitize ${instance.title} instance`,
        onClick: handlers.sanitize,
      },
    },
    {
      show: true,
      action: {
        icon: ICONS.delete,
        label: "Remove from Landscape",
        "aria-label": `Remove ${instance.title} from Landscape`,
        onClick: handlers.remove,
      },
    },
  ];

  return {
    actions: primaryConfig
      .filter((item) => item.show)
      .map((item) => item.action),

    destructiveActions: destructiveConfig
      .filter((item) => item.show)
      .map((item) => item.action),
  };
};
