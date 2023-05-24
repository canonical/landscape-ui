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
import ProfileForm from "./ProfileForm";
import useSidePanel from "../../../../hooks/useSidePanel";

interface DistributionProfileListProps {
  repositoryProfiles: RepositoryProfile[];
  accessGroupsOptions: { label: string; value: string }[];
  isGettingAccessGroups: boolean;
}

const ProfileList: FC<DistributionProfileListProps> = ({
  repositoryProfiles,
  isGettingAccessGroups,
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
    setSidePanelContent(
      "Edit Profile",
      <ProfileForm
        accessGroupsOptions={accessGroupsOptions}
        isGettingAccessGroups={isGettingAccessGroups}
        profile={profile}
      />
    );
  };

  const headers = [
    { content: "Profile" },
    { content: "Description" },
    { content: "Access Group" },
    {},
  ];

  const rows = repositoryProfiles.map((repositoryProfile) => {
    const accessGroupsOption = accessGroupsOptions.find(
      ({ value }) => value === repositoryProfile.access_group
    );

    return {
      columns: [
        {
          content: repositoryProfile.name,
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: repositoryProfile.description,
          "aria-label": "Description",
        },
        {
          content: accessGroupsOption
            ? accessGroupsOption.value
            : repositoryProfile.access_group,
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
      <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
    </>
  );
};

export default ProfileList;
