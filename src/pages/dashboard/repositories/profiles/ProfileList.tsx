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
import useAccessGroup from "../../../../hooks/useAccessGroup";

interface DistributionProfileListProps {
  repositoryProfiles: RepositoryProfile[];
}

const ProfileList: FC<DistributionProfileListProps> = ({
  repositoryProfiles,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { mutateAsync: removeRepositoryProfile, isLoading: isRemoving } =
    removeRepositoryProfileQuery;
  const { getAccessGroupQuery } = useAccessGroup();
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupsOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  }));

  const handleEditProfile = (profile: RepositoryProfile) => {
    setSidePanelOpen(true);
    setSidePanelContent(
      `Edit ${profile.title}`,
      <EditProfileForm profile={profile} />
    );
  };

  const getAccessGroupLabel = (accessGroup: string) => {
    const accessGroupOption = accessGroupsOptions.find(
      ({ value }) => accessGroup === value
    );

    return accessGroupOption ? accessGroupOption.label : accessGroup;
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
          content: getAccessGroupLabel(repositoryProfile.access_group),
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
                aria-label={`Edit ${repositoryProfile.name} repository profile`}
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
    <MainTable headers={headers} rows={rows} emptyStateMsg="No profiles yet" />
  );
};

export default ProfileList;
