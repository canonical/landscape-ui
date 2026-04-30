import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetRepositoryProfile } from "../../api";
import RepositoryProfileForm from "../RepositoryProfileForm";

const RepositoryProfileEditForm: FC = () => {
  const { name, popSidePath } = usePageParams();
  const { data: profile } = useGetRepositoryProfile(name);

  return (
    <>
      <SidePanel.Header>{`Edit ${profile.title}`}</SidePanel.Header>
      <SidePanel.Content>
        <RepositoryProfileForm
          action="edit"
          profile={profile}
          onClose={popSidePath}
        />
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileEditForm;
