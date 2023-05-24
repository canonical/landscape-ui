import { FC } from "react";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import {
  Button,
  Icon,
  ICONS,
  MainTable,
  Spinner,
} from "@canonical/react-components";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { SelectOption } from "../../../../types/SelectOption";
import EditProfileForm from "./EditProfileForm";

interface DistributionProfileListProps {
  repositoryProfiles: RepositoryProfile[];
  accessGroupsOptions: SelectOption[];
}

const ProfileList: FC<DistributionProfileListProps> = ({
  repositoryProfiles,
  accessGroupsOptions,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { mutateAsync: removeRepositoryProfile, isLoading: isRemoving } =
    removeRepositoryProfileQuery;

  const handleEditProfile = (profile: RepositoryProfile) => {
    setSidePanelOpen(true);
    setSidePanelContent("Edit Profile", <EditProfileForm profile={profile} />);
  };

  const headers = [
    { content: "Profile" },
    { content: "Description" },
    { content: "Access Group" },
    {},
  ];

  const rows = repositoryProfiles.map((repositoryProfile) => {
    return {
      columns: [
        {
          content: repositoryProfile.title,
          role: "rowheader",
          "aria-label": "Title",
        },
        {
          content: repositoryProfile.description,
          "aria-label": "Description",
        },
        {
          content: accessGroupsOptions.filter(
            ({ value }) => value === repositoryProfile.access_group
          )[0].label,
          "aria-label": "Access Group",
        },
        {
          className: "u-align--right",
          content: (
            <>
              <Button
                hasIcon
                appearance="base"
                className="u-no-margin--bottom"
                aria-label={`Remove ${repositoryProfile.name} repository profile`}
                onClick={() => {
                  handleEditProfile(repositoryProfile);
                }}
              >
                <i className="p-icon--edit" />
              </Button>
              <Button
                hasIcon
                appearance="base"
                className="u-no-margin--bottom"
                aria-label={`Remove ${repositoryProfile.name} repository profile`}
                onClick={() => {
                  confirmModal({
                    body: "Are you sure?",
                    title: "Deleting Repository Profile",
                    buttons: [
                      <Button
                        key={`delete-profile-${repositoryProfile.name}`}
                        appearance="negative"
                        hasIcon={true}
                        onClick={async () => {
                          try {
                            await removeRepositoryProfile({
                              name: repositoryProfile.name,
                            });
                            closeConfirmModal();
                          } catch (error: unknown) {
                            debug(error);
                          }
                        }}
                      >
                        {isRemoving && <Spinner />}
                        Delete
                      </Button>,
                    ],
                  });
                }}
              >
                <Icon name={ICONS.delete} />
              </Button>
            </>
          ),
        },
      ],
    };
  });

  return (
    <>
      <MainTable
        headers={headers}
        rows={rows}
        emptyStateMsg="No profiles yet"
      />
    </>
  );
};

export default ProfileList;
