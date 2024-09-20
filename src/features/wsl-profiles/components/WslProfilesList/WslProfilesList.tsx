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
  ICONS,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { WslProfile } from "../../types";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps } from "./helpers";
import classes from "./WslProfilesList.module.scss";
import { usePageParams } from "@/hooks/usePageParams";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { useWslProfiles } from "../../hooks";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

const WslProfileEditForm = lazy(() => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(() => import("../WslProfileInstallForm"));
const WslProfileDetails = lazy(() => import("../WslProfileDetails"));

interface WslProfileListProps {
  wslProfiles: WslProfile[];
}

const WslProfilesList: FC<WslProfileListProps> = ({ wslProfiles }) => {
  const { search } = usePageParams();
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { removeWslProfileQuery } = useWslProfiles();
  const { closeConfirmModal, confirmModal } = useConfirm();

  const { mutateAsync: removeWslProfile } = removeWslProfileQuery;

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const handleWslProfileDetailsOpen = (profile: WslProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <WslProfileDetails
          profile={profile}
          accessGroupOptions={accessGroupOptions}
        />
      </Suspense>,
    );
  };

  const handleWslProfileEdit = (profile: WslProfile) => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handleWslProfileDuplicate = (profile: WslProfile) => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="duplicate" profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveWslProfile = async (name: string) => {
    try {
      await removeWslProfile({ name });

      notify.success({
        message: `WSL profile "${name}" removed successfully.`,
        title: "WSL profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveWslProfileDialog = (
    name: string,
    affectedInstancesCount: number,
  ) => {
    confirmModal({
      title: `Remove ${name}`,
      body: (
        <p>
          Removing this profile will affect{" "}
          <b>{affectedInstancesCount} instances</b>. This action is
          irreversible.
        </p>
      ),
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemoveWslProfile(name)}
          aria-label={`Remove ${name} profile`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const profiles = useMemo(() => {
    if (!search) {
      return wslProfiles;
    }

    return wslProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [wslProfiles, search]);

  const columns = useMemo<Column<WslProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handleWslProfileDetailsOpen(original)}
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
        }: CellProps<WslProfile>) =>
          accessGroupOptions.find(({ value }) => value === access_group)
            ?.label ?? access_group,
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<WslProfile>) =>
          original.tags.join(", ") || <NoData />,
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
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <>
            {`${original.computers["non-compliant"].length} ${original.computers["non-compliant"].length === 1 ? "instance" : "instances"}`}
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
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <>
            {`${original.computers["pending"]?.length ?? 0} ${original.computers["pending"]?.length === 1 ? "instance" : "instances"}`}
          </>
        ),
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated",
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <>
            {`${original.computers["constrained"].length} ${original.computers["constrained"].length === 1 ? "instance" : "instances"}`}
          </>
        ),
      },
      {
        accessor: "actions",
        className: classNames("u-align-text--right", classes.actions),
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
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
              onClick={() => handleWslProfileEdit(original)}
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
              onClick={() => handleWslProfileDuplicate(original)}
              aria-label={`Edit ${original.name} profile`}
            >
              <Icon name="canvas" />
              <span>Duplicate</span>
            </Button>
            <Button
              type="button"
              appearance="base"
              hasIcon
              className="u-no-margin--bottom u-no-margin--right p-contextual-menu__link"
              onClick={() =>
                handleRemoveWslProfileDialog(
                  original.name,
                  original.computers.constrained.length,
                )
              }
              aria-label={`Remove ${original.name} profile`}
            >
              <Icon name={ICONS.delete} />
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
      emptyMsg={`No WSL profiles found with the search "${search}"`}
      getCellProps={getCellProps}
    />
  );
};

export default WslProfilesList;
