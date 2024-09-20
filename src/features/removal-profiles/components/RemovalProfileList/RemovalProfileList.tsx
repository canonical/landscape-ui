import classNames from "classnames";
import { FC, lazy, Suspense, useMemo } from "react";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import {
  Button,
  ContextualMenu,
  Icon,
  ModularTable,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { useRemovalProfiles } from "../../hooks";
import { RemovalProfile } from "../../types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./RemovalProfileList.module.scss";
import { usePageParams } from "@/hooks/usePageParams";

const RemovalProfileDetails = lazy(() => import("../RemovalProfileDetails"));
const SingleRemovalProfileForm = lazy(
  () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileListProps {
  profiles: RemovalProfile[];
}

const RemovalProfileList: FC<RemovalProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeRemovalProfileQuery } = useRemovalProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  const handleRemovalProfileEdit = (profile: RemovalProfile) => {
    setSidePanelContent(
      `Edit ${profile.title} profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const { mutateAsync: removeRemovalProfile } = removeRemovalProfileQuery;

  const handleRemovalProfileRemove = async (name: string) => {
    try {
      await removeRemovalProfile({ name });
      notify.success({
        message: `${name} profile removed successfully`,
        title: "Removal profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovalProfileRemoveDialog = (name: string) => {
    confirmModal({
      title: "Remove removal profile",
      body: `This will remove "${name}" profile`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovalProfileRemove(name)}
          aria-label={`Remove "${name}" profile`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleRemovalProfileDetailsOpen = (profile: RemovalProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <RemovalProfileDetails
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<RemovalProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <Button
            type="button"
            appearance="link"
            onClick={() => handleRemovalProfileDetailsOpen(original)}
            className="u-no-margin--bottom u-no-padding--top"
            aria-label={`Open "${original.title}" profile details`}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <>
            {accessGroupOptions.find(
              (option) => option.value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <>{original.tags.join(", ")}</>
        ),
      },
      {
        accessor: "associated",
        Header: "Associated",
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <ContextualMenu
            position="left"
            toggleClassName={classes.toggleButton}
            toggleAppearance="base"
            toggleLabel={<Icon name="contextual-menu" />}
          >
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={() => handleRemovalProfileEdit(original)}
              aria-label={`Edit "${original.title}" profile`}
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
              onClick={() => handleRemovalProfileRemoveDialog(original.name)}
              aria-label={`Remove "${original.title}" profile`}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          </ContextualMenu>
        ),
      },
    ],
    [filteredProfiles],
  );

  return (
    <ModularTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No removal profiles found with the search: "${search}"`}
    />
  );
};

export default RemovalProfileList;
