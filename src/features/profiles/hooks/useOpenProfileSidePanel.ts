import type { Profile, ProfileActions } from "../types";
import usePageParams from "@/hooks/usePageParams";
import { usesNameAsIdentifier } from "../helpers";

export const useOpenProfileSidePanel = () => {
  const { sidePath, setPageParams, createSidePathPusher } = usePageParams();

  return (profile: Profile, action: ProfileActions) => {
    const profileIdentifier = usesNameAsIdentifier(profile)
      ? profile.name
      : `${profile.id}`;

    if (!sidePath.length || action === "view") {
      setPageParams({
        sidePath: [action],
        name: profileIdentifier,
      });
    } else {
      createSidePathPusher(action)();
    }
  };
};
