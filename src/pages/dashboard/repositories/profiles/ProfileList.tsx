import { FC, useMemo } from "react";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
} from "@canonical/react-components";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { SelectOption } from "../../../../types/SelectOption";
import EditProfileForm from "./EditProfileForm";
import useAccessGroup from "../../../../hooks/useAccessGroup";
import classes from "./ProfileList.module.scss";
import { Column } from "@canonical/react-components/node_modules/@types/react-table";
import { CellProps } from "react-table";

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
      <EditProfileForm profile={profile} />,
    );
  };

  const getAccessGroupLabel = (accessGroup: string) => {
    const accessGroupOption = accessGroupsOptions.find(
      ({ value }) => accessGroup === value,
    );

    return accessGroupOption ? accessGroupOption.label : accessGroup;
  };

  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
      },
      {
        accessor: "description",
        Header: "Description",
        className: classes.description,
      },
      {
        accessor: "access_group",
        Header: "Access group",
        className: classes.accessGroup,
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <>{getAccessGroupLabel(row.original.access_group)}</>
        ),
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <div className={classes.dividedBlocks}>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Edit ${row.original.name} repository profile`}
                onClick={() => {
                  handleEditProfile(row.original);
                }}
              >
                <span className="p-tooltip__message">Edit</span>
                <i className="p-icon--edit u-no-margin--left" />
              </Button>
            </div>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Remove ${row.original.name} repository profile`}
                onClick={() => {
                  confirmModal({
                    body: "Are you sure?",
                    title: `Deleting ${row.original.name} repository profile`,
                    buttons: [
                      <Button
                        key={`delete-profile-${row.original.name}`}
                        appearance="negative"
                        hasIcon={true}
                        onClick={async () => {
                          try {
                            await removeRepositoryProfile({
                              name: row.original.name,
                            });
                          } catch (error: unknown) {
                            debug(error);
                          } finally {
                            closeConfirmModal();
                          }
                        }}
                        aria-label={`Delete ${row.original.name} repository profile`}
                      >
                        {isRemoving && <Spinner />}
                        Delete
                      </Button>,
                    ],
                  });
                }}
              >
                <span className="p-tooltip__message">Delete</span>
                <Icon name={ICONS.delete} className="u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <ModularTable
      columns={columns}
      data={useMemo(() => repositoryProfiles, [repositoryProfiles])}
      getCellProps={({ column }) => {
        switch (column.id) {
          case "title":
            return { role: "rowheader" };
          case "description":
            return { "aria-label": "Description" };
          case "access_group":
            return { "aria-label": "Access group" };
          case "id":
            return { "aria-label": "Actions" };
          default:
            return {};
        }
      }}
      emptyMsg="No profiles yet."
    />
  );
};

export default ProfileList;
