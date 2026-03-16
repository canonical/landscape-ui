import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Suspense } from "react";
import type { Profile } from "../types";
import ViewProfileSidePanel from "../components/ViewProfileSidePanel";
import { type ProfileTypes } from "../helpers";

export const useOpenViewProfileSidePanel = () => {
  const { setSidePanelContent } = useSidePanel(); 

  return (type: ProfileTypes, profile: Profile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <ViewProfileSidePanel profile={profile} type={type} />
      </Suspense>,
    ); 
  };
};
