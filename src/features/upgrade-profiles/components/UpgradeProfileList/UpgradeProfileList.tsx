import classNames from "classnames";
import { FC, lazy, Suspense, useMemo } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  ContextualMenu,
  Icon,
  ModularTable,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { useUpgradeProfiles } from "../../hooks";
import { UpgradeProfile } from "../../types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import classes from "./UpgradeProfileList.module.scss";

const SingleUpgradeProfileForm = lazy(
  () => import("../SingleUpgradeProfileForm"),
);
const UpgradeProfileDetails = lazy(() => import("../UpgradeProfileDetails"));

interface UpgradeProfileListProps {
  profiles: UpgradeProfile[];
  search: string;
}

const UpgradeProfileList: FC<UpgradeProfileListProps> = ({
  profiles,
  search,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.includes(search);
    });
  }, [profiles, search]);

  const { mutateAsync: removeUpgradeProfile } = removeUpgradeProfileQuery;

  const handleRemoveUpgradeProfile = async (name: string) => {
    try {
      await removeUpgradeProfile({ name });

      notify.success({
        message: `Upgrade profile "${name}" removed successfully`,
        title: "Upgrade profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveUpgradeProfileDialog = (name: string) => {
    confirmModal({
      title: "Remove upgrade profile",
      body: `This will remove "${name}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemoveUpgradeProfile(name)}
          aria-label={`Remove ${name} profile`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleUpgradeProfileDetailsOpen = (profile: UpgradeProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <UpgradeProfileDetails
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const handleUpgradeProfileEdit = (profile: UpgradeProfile) => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<UpgradeProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handleUpgradeProfileDetailsOpen(original)}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>
            {accessGroupOptions.find(
              ({ value }) => value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>{original.tags.join(", ")}</>
        ),
      },
      {
        accessor: "associated",
        Header: "Associated",
      },
      {
        accessor: "actions",
        className: classNames("u-align-text--right", classes.actions),
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <ContextualMenu
            position="left"
            toggleClassName={classes.toggleButton}
            toggleAppearance="base"
            toggleLabel={<Icon name="contextual-menu" aria-hidden />}
            toggleProps={{ "aria-label": `${original.name} profile actions` }}
          >
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={() => handleUpgradeProfileEdit(original)}
              aria-label={`Edit ${original.name} profile`}
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
              onClick={() => handleRemoveUpgradeProfileDialog(original.name)}
              aria-label={`Remove ${original.name} profile`}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          </ContextualMenu>
        ),
      },
    ],
    [filteredProfiles, accessGroupOptions.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No profiles found with the search: "${search}"`}
    />
  );
};

export default UpgradeProfileList;
