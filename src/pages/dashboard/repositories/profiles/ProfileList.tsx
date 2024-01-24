import { FC, HTMLProps, lazy, Suspense, useMemo } from "react";
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
import useAccessGroup from "../../../../hooks/useAccessGroup";
import classes from "./ProfileList.module.scss";
import { Cell, CellProps, Column, TableCellProps } from "react-table";
import LoadingState from "../../../../components/layout/LoadingState";

const EditProfileForm = lazy(() => import("./EditProfileForm"));

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
      <Suspense fallback={<LoadingState />}>
        <EditProfileForm profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveProfile = (profileName: string) => {
    confirmModal({
      body: "Are you sure?",
      title: `Deleting ${profileName} repository profile`,
      buttons: [
        <Button
          key={`delete-profile-${profileName}`}
          appearance="negative"
          hasIcon={true}
          onClick={async () => {
            try {
              await removeRepositoryProfile({
                name: profileName,
              });
            } catch (error: unknown) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
          aria-label={`Delete ${profileName} repository profile`}
        >
          {isRemoving && <Spinner />}
          Delete
        </Button>,
      ],
    });
  };

  const getAccessGroupLabel = (accessGroup: string) => {
    return (
      accessGroupsOptions.find(({ value }) => accessGroup === value)?.label ??
      accessGroup
    );
  };

  const profiles = useMemo(() => repositoryProfiles, [repositoryProfiles]);

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
                onClick={() => handleRemoveProfile(row.original.name)}
              >
                <span className="p-tooltip__message">Delete</span>
                <Icon name={ICONS.delete} className="u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [profiles, accessGroupsOptions],
  );

  const handleCellProps = ({ column }: Cell<RepositoryProfile>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (column.id === "title") {
      cellProps.role = "rowheader";
    } else if (column.id === "description") {
      cellProps["aria-label"] = "Description";
    } else if (column.id === "access_group") {
      cellProps["aria-label"] = "Access group";
    } else if (column.id === "id") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      getCellProps={handleCellProps}
      emptyMsg="No profiles yet."
    />
  );
};

export default ProfileList;
