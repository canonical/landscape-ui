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
  ContextualMenu,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
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
import classNames from "classnames";

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
        className: classNames("u-align-text--right", classes.actions),
        Header: "Actions",
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <ContextualMenu
            position="left"
            toggleClassName={classes.toggleButton}
            toggleAppearance="base"
            toggleLabel={<Icon name="contextual-menu" aria-hidden />}
            toggleProps={{
              "aria-label": `${row.original.name} profile actions`,
            }}
          >
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={(event) => handleEditProfile(event, row.original)}
              aria-label={`Edit ${row.original.name} profile`}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={() => handleRemoveProfileDialog(row.original.name)}
              aria-label={`Remove ${row.original.name} repository profile`}
            >
              <Icon name={ICONS.delete} />
              <span>Remove</span>
            </Button>
          </ContextualMenu>
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
