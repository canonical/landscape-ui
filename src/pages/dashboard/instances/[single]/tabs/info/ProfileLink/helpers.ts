import { ROUTES } from "@/libs/routes";
import type { Profile } from "@/types/Profile";

export const getTo = (profile: Profile) => {
  switch (profile.type) {
    case "package":
      return ROUTES.profiles.package({
        sidePath: ["view"],
        name: profile.name || "",
      });
    case "reboot":
      return ROUTES.profiles.reboot({
        sidePath: ["view"],
        name: profile.id.toString() || "",
      });
    case "removal":
      return ROUTES.profiles.removal({
        sidePath: ["view"],
        name: profile.id.toString() || "",
      });
    case "repository":
      return ROUTES.repositories.repositoryProfiles({
        search: profile.title || "",
      });
    case "script":
      return ROUTES.scripts.root({
        tab: "profiles",
        sidePath: ["view"],
        name: profile.id.toString() || "",
      });
    case "usg":
      return ROUTES.profiles.usg({
        sidePath: ["view"],
        name: profile.id.toString() || "",
      });
    case "upgrade":
      return ROUTES.profiles.upgrade({
        sidePath: ["view"],
        name: profile.id.toString() || "",
      });
    case "wsl":
      return ROUTES.profiles.wsl({
        sidePath: ["view"],
        name: profile.name || "",
      });
  }
};
