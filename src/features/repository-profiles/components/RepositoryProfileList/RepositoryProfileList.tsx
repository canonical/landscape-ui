import {
  FC,
  lazy,
  MouseEvent as ReactMouseEvent,
  Suspense,
  useMemo,
} from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { useRepositoryProfiles } from "../../hooks";
import { RepositoryProfile } from "../../types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { handleCellProps } from "./helpers";
import classes from "./RepositoryProfileList.module.scss";

const RepositoryProfileForm = lazy(() => import("../RepositoryProfileForm"));

interface RepositoryProfileListProps {
  repositoryProfiles: RepositoryProfile[];
}

const RepositoryProfileList: FC<RepositoryProfileListProps> = ({
  repositoryProfiles,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { mutateAsync: removeRepositoryProfile, isLoading: isRemoving } =
    removeRepositoryProfileQuery;
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  const handleEditProfile = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    profile: RepositoryProfile,
  ) => {
    event.currentTarget.blur();

    setSidePanelContent(
      `Edit ${profile.title}`,
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveProfile = async (profileName: string) => {
    try {
      await removeRepositoryProfile({
        name: profileName,
      });
    } catch (error: unknown) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveProfileDialog = (profileName: string) => {
    confirmModal({
      body: "Are you sure?",
      title: `Deleting ${profileName} repository profile`,
      buttons: [
        <Button
          key={`delete-profile-${profileName}`}
          appearance="negative"
          hasIcon={true}
          onClick={() => handleRemoveProfile(profileName)}
          aria-label={`Delete ${profileName} repository profile`}
        >
          {isRemoving && <Spinner />}
          Delete
        </Button>,
      ],
    });
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
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          accessGroupOptions.find(
            ({ value }) => original.access_group === value,
          )?.label ?? original.access_group,
      },
      {
        accessor: "id",
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <div className="divided-blocks">
            <div className="divided-blocks__item">
              <Tooltip message="Edit" position="btm-center">
                <Button
                  small
                  hasIcon
                  appearance="base"
                  className="u-no-margin--bottom u-no-padding--left"
                  aria-label={`Edit ${row.original.name} repository profile`}
                  onClick={(event) => handleEditProfile(event, row.original)}
                >
                  <i className="p-icon--edit u-no-margin--left" />
                </Button>
              </Tooltip>
            </div>
            <div className="divided-blocks__item">
              <Tooltip message="Delete" position="btm-center">
                <Button
                  small
                  hasIcon
                  appearance="base"
                  className="u-no-margin--bottom u-no-padding--left"
                  aria-label={`Remove ${row.original.name} repository profile`}
                  onClick={() => handleRemoveProfileDialog(row.original.name)}
                >
                  <Icon name={ICONS.delete} className="u-no-margin--left" />
                </Button>
              </Tooltip>
            </div>
          </div>
        ),
      },
    ],
    [profiles, accessGroupOptions],
  );

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      getCellProps={handleCellProps}
      emptyMsg="No profiles yet."
    />
  );
};

export default RepositoryProfileList;
