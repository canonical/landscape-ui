import type { Profile } from "@/types/Profile";

export const getTo = (profile: Profile) => {
  switch (profile.type) {
    case "package":
      return `/profiles/package?sidePath=view&profile=${profile.name}`;
    case "reboot":
      return `/profiles/reboot?sidePath=view&profile=${profile.id}`;
    case "removal":
      return `/profiles/removal?sidePath=view&profile=${profile.id}`;
    case "repository":
      return `/profiles/repository?sidePath=view&profile=${profile.id}`;
    case "script":
      return `/scripts?tab=profiles&sidePath=view&profile=${profile.id}`;
    case "security":
      return `/profiles/security?sidePath=view&profile=${profile.id}`;
    case "upgrade":
      return `/profiles/upgrade?sidePath=view&profile=${profile.id}`;
    case "wsl":
      return `/profiles/wsl?sidePath=view&profile=${profile.name}`;
  }
};
