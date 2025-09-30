import { ROUTES } from "@/libs/routes";
import type { Profile } from "@/types/Profile";

export const getTo = (profile: Profile) => {
  switch (profile.type) {
    case "package":
      return ROUTES.profiles.package({
        sidePath: ["view"],
        profile: profile.name || "",
      });
    case "reboot":
      return ROUTES.profiles.reboot({
        sidePath: ["view"],
        profile: profile.id.toString() || "",
      });
    case "removal":
      return ROUTES.profiles.removal({
        sidePath: ["view"],
        profile: profile.id.toString() || "",
      });
    case "repository":
      return ROUTES.profiles.repository({
        search: profile.title || "",
      });
    case "script":
      return ROUTES.scripts.root({
        tab: "profiles",
        sidePath: ["view"],
        profile: profile.id.toString() || "",
      });
    case "security":
      return ROUTES.profiles.security({
        sidePath: ["view"],
        profile: profile.id.toString() || "",
      });
    case "upgrade":
      return ROUTES.profiles.upgrade({
        sidePath: ["view"],
        profile: profile.id.toString() || "",
      });
    case "wsl":
      return ROUTES.profiles.wsl({
        sidePath: ["view"],
        profile: profile.name || "",
      });
  }
};
