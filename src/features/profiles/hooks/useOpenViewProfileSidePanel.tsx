import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { lazy, Suspense } from "react";
import type { Profile } from "../types";
import { type ProfileTypes } from "../helpers";

const ViewProfileSidePanel = lazy(
  async () => import("../components/ViewProfileSidePanel"),
);

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
