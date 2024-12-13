import {
  Button,
  CheckboxInput,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { FC, lazy, Suspense, useMemo } from "react";
import { User } from "@/types/User";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./UserList.module.scss";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { handleCellProps } from "./helpers";
import NoData from "@/components/layout/NoData";

const EditUserForm = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);
const UserDetails = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/UserDetails"),
);

interface UserListProps {
  users: User[];
  selected: number[];
  setSelected: (userIds: number[]) => void;
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
        accessor: "username",
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all</span>}
              inline
              onChange={toggleAll}
              checked={users.length > 0 && selected.length === users.length}
              indeterminate={
                selected.length > 0 && selected.length < users.length
              }
            />
            <span>username</span>
          </>
        ),
        Cell: ({ row }: CellProps<User>) => (
          <>
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">
                  Select user {row.original.username}
                </span>
              }
              checked={selected.includes(row.original.uid)}
              onChange={() => handleSelectionChange(row.original.uid)}
            />
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => handleShowUserDetails(row.original)}
              aria-label={`Show details of user ${row.original.username}`}
            >
              {row.original.username}
            </Button>
          </>
        ),
      },
      {
        Header: "status",
        accessor: "enabled",
        sortType: "basic",
        Cell: ({ row }: CellProps<User>) => (
          <div className={classes.status}>
            {row.original.enabled ? (
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
      {
        Header: "UID",
        accessor: "uid",
        sortType: "basic",
      },
      {
        Header: "Full Name",
        accessor: "name",
        sortType: "basic",
        Cell: ({ row }: CellProps<User>) => row.original.name || <NoData />,
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<User>) => (
          <Tooltip message="Edit" position="btm-center">
            <Button
              type="button"
              small
              hasIcon
              appearance="base"
              className="u-no-margin--bottom u-no-padding--left"
              aria-label={`Edit ${row.original.name} profile`}
              onClick={() => handleEditUser(row.original)}
            >
              <Icon name="edit" className="u-no-margin--left" />
            </Button>
          </Tooltip>
        ),
      },
    ],
    [users, selected],
  );

  return (
    <ModularTable
      columns={columns}
      data={users}
      emptyMsg="No users available"
      sortable
      initialSortDirection="ascending"
      initialSortColumn="username"
      getCellProps={handleCellProps}
    />
  );
};

export default UserList;
