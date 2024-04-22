import { Button, CheckboxInput, MainTable } from "@canonical/react-components";
import { FC, Suspense, lazy } from "react";
import { User } from "@/types/User";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./UserList.module.scss";

const EditUserForm = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);
const UserDetails = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/UserDetails"),
);

interface UserListProps {
  instanceId: number;
  users: User[];
  selected: number[];
  setSelected: (value: number[]) => void;
}

const UserList: FC<UserListProps> = ({
  instanceId,
  users,
  selected,
  setSelected,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleEditUser = (user: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm instanceId={instanceId} user={user} />
      </Suspense>,
    );
  };

  const handleShowUserDetails = (user: User) => {
    setSidePanelContent(
      "User details",
      <Suspense fallback={<LoadingState />}>
        <UserDetails
          user={user}
          instanceId={instanceId}
          handleEditUser={handleEditUser}
        />
      </Suspense>,
    );
  };

  const toggleAll = () => {
    setSelected(selected.length !== 0 ? [] : users.map(({ uid }) => uid));
  };

  const handleSelectionChange = (user: User) => {
    selected.includes(user.uid)
      ? setSelected(selected.filter((id) => id !== user.uid))
      : setSelected([...selected, user.uid]);
  };

  const headers = [
    {
      content: (
        <>
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all</span>}
            checked={selected.length === users.length && users.length > 0}
            onChange={toggleAll}
            indeterminate={
              selected.length > 0 && selected.length < users.length
            }
          />
          <span>USERNAME</span>
        </>
      ),
    },
    { content: "Status", sortKey: "status" },
    { content: "UID" },
    { content: "Full Name" },
    { content: "" },
  ];
  const rows = users.map((user) => {
    return {
      columns: [
        {
          content: (
            <>
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">{`Select user ${user.username}`}</span>
                }
                checked={selected.includes(user.uid)}
                onChange={() => handleSelectionChange(user)}
              />
              <Button
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top"
                onClick={() => {
                  handleShowUserDetails(user);
                }}
                aria-label={`Show details of user ${user.username}`}
              >
                {user.username}
              </Button>
            </>
          ),
          role: "rowheader",
          "aria-label": `User ${user.username}`,
        },
        {
          content: (
            <div className={classes.status}>
              {user.enabled ? (
                <>
                  <i className="p-icon--lock-unlock" />
                  <span>Unlocked</span>
                </>
              ) : (
                <>
                  <i className="p-icon--lock-locked-active" />
                  <span>Locked</span>
                </>
              )}
            </div>
          ),
          "aria-label": `User ${user.username} status`,
        },
        { content: user.uid, "aria-label": "uid" },
        {
          content: user.name ? user.name : "-",
          "aria-label": "full name",
        },
        {
          className: classes.actions,
          content: (
            <Button
              small
              hasIcon
              appearance="base"
              className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
              aria-label={`Edit ${user.name} profile`}
              onClick={() => {
                handleEditUser(user);
              }}
            >
              <span className="p-tooltip__message">Edit</span>
              <i className="p-icon--edit u-no-margin--left" />
            </Button>
          ),
        },
      ],
      sortData: {
        status: user.enabled,
        uid: user.uid,
        fullname: user.username,
      },
    };
  });

  return <MainTable headers={headers} rows={rows} sortable />;
};

export default UserList;
