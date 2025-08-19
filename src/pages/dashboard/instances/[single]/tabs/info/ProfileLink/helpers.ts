import type { Profile } from "@/types/Profile";

export const getTo = (profile: Profile) => {
  switch (profile.type) {
    case "package":
      return `/profiles/package?sidePath=view&packageProfile=${profile.name}`;
    case "reboot":
      return `/profiles/reboot?sidePath=view&rebootProfile=${profile.id}`;
    case "removal":
      return `/profiles/removal?sidePath=view&removalProfile=${profile.id}`;
    case "repository":
      return `/profiles/repository?sidePath=view&repositoryProfile=${profile.id}`;
    case "script":
      return `/scripts?tab=profiles&sidePath=view&scriptProfile=${profile.id}`;
    case "security":
      return `/profiles/security?sidePath=view&securityProfile=${profile.id}`;
    case "upgrade":
      return `/profiles/upgrade?sidePath=view&upgradeProfile=${profile.id}`;
    case "wsl":
      return `/profiles/wsl?sidePath=view&wslProfile=${profile.name}`;
  }
};
