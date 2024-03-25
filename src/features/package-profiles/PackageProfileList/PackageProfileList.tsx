import classNames from "classnames";
import { FC, Suspense, useMemo } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  ContextualMenu,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { PackageProfile } from "@/features/package-profiles/types/PackageProfile";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import { SelectOption } from "@/types/SelectOption";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps } from "./helpers";
import classes from "./PackageProfileList.module.scss";
import usePackageProfiles from "@/features/package-profiles/hooks/usePackageProfiles";
import useConfirm from "@/hooks/useConfirm";
import useSidePanel from "@/hooks/useSidePanel";
import PackageProfileDetails from "@/features/package-profiles/PackageProfileDetails";
import PackageProfileConstraintsEditForm from "@/features/package-profiles/PackageProfileConstraintsEditForm";
import PackageProfileEditForm from "@/features/package-profiles/PackageProfileEditForm";
import PackageProfileDuplicateForm from "@/features/package-profiles/PackageProfileDuplicateForm";
import useNotify from "@/hooks/useNotify";

interface PackageProfileListProps {
  packageProfiles: PackageProfile[];
  searchText: string;
}

const PackageProfileList: FC<PackageProfileListProps> = ({
  packageProfiles,
  searchText,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { setSidePanelContent, changeSidePanelTitleLabel } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { removePackageProfileQuery } = usePackageProfiles();

  const {
    data: getAccessGroupQueryResult,
    error: getAccessGroupQueryResultError,
  } = getAccessGroupQuery();

  if (getAccessGroupQueryResultError) {
    debug(getAccessGroupQueryResultError);
  }

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: removePackageProfile } = removePackageProfileQuery;

  const handleRemovePackageProfile = async (name: string) => {
    try {
      await removePackageProfile({ name });

      notify.success({
        message: `Package profile "${name}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovePackageProfileDialog = (name: string) => {
    confirmModal({
      title: "Remove package profile",
      body: `This will remove "${name}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovePackageProfile(name)}
          aria-label="Remove ${name} profile"
        >
          Remove
        </Button>,
      ],
    });
  };

  const handlePackageProfileDetailsOpen = (profile: PackageProfile) => {
    setSidePanelContent(
      profile.title,
      <PackageProfileDetails profile={profile} />,
      "medium",
    );
  };

  const handleConstraintsChange = (profile: PackageProfile) => () => {
    setSidePanelContent(
      "Change package constraints",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handlePackageProfileEdit = (profile: PackageProfile) => {
    setSidePanelContent(
      "Edit package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = (profile: PackageProfile) => {
    setSidePanelContent(
      "Duplicate package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
    changeSidePanelTitleLabel("Step 1 of 2");
  };

  const profiles = useMemo(() => {
    if (!searchText) {
      return packageProfiles;
    }

    return packageProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [packageProfiles, searchText]);

  const columns = useMemo<Column<PackageProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handlePackageProfileDetailsOpen(original)}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "description",
        className: classNames(classes.truncated, classes.description),
        Header: "Description",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({
          row: {
            original: { access_group },
          },
        }: CellProps<PackageProfile>) =>
          accessGroupOptions.find(({ value }) => value === access_group)
            ?.label ?? access_group,
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({
          row: {
            original: { tags },
          },
        }: CellProps<PackageProfile>) => tags.join(", "),
      },
      {
        accessor: "computers['non-compliant']",
        Header: (
          <div className={classes.noWrap}>
            <span>Not compliant </span>
            <Tooltip position="btm-left" message={NON_COMPLIANT_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["non-compliant"].length} instance${original.computers["non-compliant"].length === 1 ? " " : "s"}`}
          </>
        ),
      },
      {
        accessor: "computers['pending']",
        Header: (
          <div className={classes.noWrap}>
            <span>Pending </span>
            <Tooltip position="btm-left" message={PENDING_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["pending"]?.length ?? 0} instance${original.computers["pending"]?.length === 1 ? " " : "s"}`}
          </>
        ),
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["constrained"].length} instance${original.computers["constrained"].length === 1 ? " " : "s"}`}
          </>
        ),
      },
      {
        accessor: "actions",
        className: classNames("u-align-text--right", classes.actions),
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
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
              onClick={() => handlePackageProfileEdit(original)}
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
              onClick={handleConstraintsChange(original)}
            >
              <Icon name="applications" />
              <span className={classes.noWrap}>Change package constraints</span>
            </Button>
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={() => handlePackageProfileDuplicate(original)}
            >
              <Icon name="canvas" />
              <span>Duplicate</span>
            </Button>
            <Button
              type="button"
              appearance="base"
              hasIcon
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              onClick={() => handleRemovePackageProfileDialog(original.name)}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          </ContextualMenu>
        ),
      },
    ],
    [profiles, accessGroupOptions.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      emptyMsg={`No package profiles found with the search "${searchText}"`}
      getCellProps={getCellProps}
    />
  );
};

export default PackageProfileList;
