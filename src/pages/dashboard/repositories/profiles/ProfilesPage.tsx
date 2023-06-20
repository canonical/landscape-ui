import { FC } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import LoadingState from "../../../../components/layout/LoadingState";
import EmptyState from "../../../../components/layout/EmptyState";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import ProfileList from "./ProfileList";
import AddProfileForm from "./AddProfileForm";

const ProfilesPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const { data: repositoryProfilesResponse, isLoading } =
    getRepositoryProfilesQuery();

  const repositoryProfiles = repositoryProfilesResponse?.data ?? [];

  const handleAddProfile = () => {
    setSidePanelOpen(true);
    setSidePanelContent("Add Profile", <AddProfileForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Repository Profiles"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleAddProfile}
            type="button"
          >
            New Profile
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && repositoryProfiles.length === 0 && (
          <EmptyState
            title="No profiles found"
            icon="copy"
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven’t added any profile yet.
                </p>
                <a href="https://ubuntu.com/landscape/docs/repositories">
                  How to manage profiles in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="table-create-new-profile"
                onClick={handleAddProfile}
                type="button"
              >
                Add profile
              </Button>,
            ]}
          />
        )}
        {!isLoading && repositoryProfiles.length > 0 && (
          <ProfileList repositoryProfiles={repositoryProfiles} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default ProfilesPage;
