import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetRepositoryProfile } from "../../api";
import RepositoryProfileForm from "../RepositoryProfileForm";

const RepositoryProfileEditForm: FC = () => {
  const { name, sidePath, popSidePath, createPageParamsSetter } =
    usePageParams();
  const { data: profile } = useGetRepositoryProfile(name);
  const closePanel = createPageParamsSetter({ sidePath: [], name: "" });

  return (
    <>
      <SidePanel.Header>{`Edit ${profile.title}`}</SidePanel.Header>
      <SidePanel.Content>
        <RepositoryProfileForm
          action="edit"
          profile={profile}
          onClose={closePanel}
          hasBackButton={sidePath.length > 1}
          onBackButtonPress={popSidePath}
        />
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileEditForm;
