import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import type { Profile, ProfileType } from "../types";
import ViewProfileSidePanel from "../components/ViewProfileSidePanel";

export const useOpenViewProfileSidePanel = () => {
  const { setSidePanelContent } = useSidePanel(); 

  return ({ type, profile }: { type: ProfileType, profile: Profile }) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <ViewProfileSidePanel
          profile={profile}
          type={type}
        />
      </Suspense>,
    ); 
  };
};
