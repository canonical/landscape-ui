import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { capitalize } from "@/utils/_helpers";
import { type ComponentProps, Suspense } from "react";
import { ManageProfileForm } from "..";

export const useOpenManageProfileForm = () => {
  const { setSidePanelContent } = useSidePanel(); 

  return (
    { type, action, profile }: ComponentProps<typeof ManageProfileForm>
  ) => {
    const title = profile ? `${capitalize(action)} ${profile.title}` : "Add new profile";
    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <ManageProfileForm
          profile={profile}
          type={type}
          action={action}
        />
      </Suspense>,
    ); 
  };
};
