import type { Profile, ProfileActions } from "../types";
import usePageParams from "@/hooks/usePageParams";
import { usesNameAsIdentifier } from "../helpers";

export const useOpenManageProfileSidePanel = () => {
  const { setPageParams } = usePageParams();

  return (profile: Profile, action: ProfileActions) => {
    const profileIdentifier = usesNameAsIdentifier(profile) ? profile.name : `${profile.id}`;

    setPageParams({
      sidePath: [action],
      profile: profileIdentifier,
    });
  };
};
