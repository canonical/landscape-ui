import ListActions, {
  LIST_ACTIONS_COLUMN_PROPS,
} from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useSidePanel from "@/hooks/useSidePanel";
import type { User } from "@/types/User";
import { Button, CheckboxInput, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import classes from "./UserList.module.scss";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { CellProps, Column } from "react-table";

const EditUserForm = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);
const UserDetails = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/users/UserDetails"),
);

interface UserListProps {
  readonly users: User[];
  readonly selected: number[];
  readonly setSelected: (userIds: number[]) => void;
}

const UserList: FC<UserListProps> = ({ users, selected, setSelected }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleEditUser = (user: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm user={user} />
      </Suspense>,
    );
  };

  const handleShowUserDetails = (user: User) => {
    setSidePanelContent(
      "User details",
      <Suspense fallback={<LoadingState />}>
        <UserDetails user={user} />
      </Suspense>,
    );
  };

  const toggleAll = () => {
    setSelected(selected.length !== 0 ? [] : users.map(({ uid }) => uid));
  };

  const handleSelectionChange = (uid: number) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((id) => id !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            label={<span className="u-off-screen">Toggle all</span>}
            labelClassName="u-no-margin--bottom u-no-padding--top"
            onChange={toggleAll}
            checked={users.length > 0 && selected.length === users.length}
            indeterminate={
              selected.length > 0 && selected.length < users.length
            }
            disabled={users.length === 0}
          />
        ),
        Cell: ({ row: { original } }: CellProps<User>) => (
          <CheckboxInput
            inline
            label={
              <span className="u-off-screen">
                Select user {original.username}
              </span>
            }
            disabled={users.length === 0}
            checked={selected.includes(original.uid)}
            onChange={() => {
              handleSelectionChange(original.uid);
            }}
          />
        ),
      },
      {
        Header: "username",
        role: "rowheader",
        Cell: ({ row: { original } }: CellProps<User>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              handleShowUserDetails(original);
            }}
            aria-label={`Show details of user ${original.username}`}
          >
            {original.username}
          </Button>
        ),
      },
      {
        Header: "status",
        className: classes.statusCell,
        Cell: ({ row: { original } }: CellProps<User>) => (
          <div className={classes.status}>
            {original.enabled ? (
              <>
                <Icon name="lock-unlock" />
                <span>Unlocked</span>
              </>
            ) : (
              <>
                <Icon name="lock-locked-active" />
                <span>Locked</span>
              </>
            )}
          </div>
        ),
      },
      { Header: "UID", accessor: "uid" },
      {
        Header: "Full name",
        Cell: ({ row: { original } }: CellProps<User>) =>
          original.name || <NoData />,
      },
      {
        Header: LIST_ACTIONS_COLUMN_PROPS.Header,
        className: LIST_ACTIONS_COLUMN_PROPS.className,
        Cell: ({ row: { original } }: CellProps<User>) => (
          <ListActions
            toggleAriaLabel={`"${original.name}" user actions`}
            actions={[
              {
                icon: "edit",
                label: "Edit",
                "aria-label": `Edit "${original.name}" user`,
                onClick: () => {
                  handleEditUser(original);
                },
              },
            ]}
          />
        ),
      },
    ],
    [users, selected],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={users}
      emptyMsg="No users found according to your search parameters."
    />
  );
};

export default UserList;
