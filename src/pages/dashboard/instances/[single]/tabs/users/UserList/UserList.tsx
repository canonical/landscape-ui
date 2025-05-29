import ListActions, {
  LIST_ACTIONS_COLUMN_PROPS,
} from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import type { User } from "@/types/User";
import { getTableSortOrder } from "@/utils/output";
import {
  Button,
  CheckboxInput,
  Icon,
  MainTable,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { SORT_KEYS } from "../constants";
import classes from "./UserList.module.scss";

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
  const { setPageParams, sortBy, sort } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  useSetDynamicFilterValidation("sortBy", Object.values(SORT_KEYS));
  useSetDynamicFilterValidation("sort", ["asc", "desc"]);

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

  const headers = useMemo(
    () => [
      {
        className: "checkbox-column",
        content: (
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
      },
      {
        sortKey: SORT_KEYS.username,
        content: "username",
      },
      { content: "status", sortKey: SORT_KEYS.status },
      { content: "uid", sortKey: SORT_KEYS.uid },
      { content: "full name", sortKey: SORT_KEYS.name },
      {
        content: LIST_ACTIONS_COLUMN_PROPS.Header,
        className: LIST_ACTIONS_COLUMN_PROPS.className,
      },
    ],
    [users, selected],
  );

  const rows = useMemo(
    () =>
      users.map((user) => ({
        columns: [
          {
            accessor: "checkbox",
            className: "checkbox-column",
            content: (
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">
                    Select user {user.username}
                  </span>
                }
                disabled={users.length === 0}
                checked={selected.includes(user.uid)}
                onChange={() => {
                  handleSelectionChange(user.uid);
                }}
              />
            ),
          },
          {
            content: (
              <Button
                type="button"
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top"
                onClick={() => {
                  handleShowUserDetails(user);
                }}
                aria-label={`Show details of user ${user.username}`}
              >
                {user.username}
              </Button>
            ),
            role: "rowheader",
          },
          {
            className: classes.statusCell,
            content: (
              <div className={classes.status}>
                {user.enabled ? (
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
            content: user.uid,
          },
          {
            content: user.name || <NoData />,
          },
          {
            className: LIST_ACTIONS_COLUMN_PROPS.className,
            content: (
              <ListActions
                toggleAriaLabel={`"${user.name}" user actions`}
                actions={[
                  {
                    icon: "edit",
                    label: "Edit",
                    "aria-label": `Edit "${user.name}" user`,
                    onClick: () => {
                      handleEditUser(user);
                    },
                  },
                ]}
              />
            ),
          },
        ],
      })),
    [users, selected],
  );

  const handleUpdateSort = (sortKey: string | null | undefined) => {
    setSelected([]);

    if (!sortKey) {
      setPageParams({
        sort: null,
        sortBy: "",
      });

      return;
    }

    const newSortOrder = sortKey === sortBy && sort === "asc" ? "desc" : "asc";

    setPageParams({
      sort: newSortOrder,
      sortBy: sortKey,
    });
  };

  return (
    <MainTable
      headers={headers}
      rows={rows}
      onUpdateSort={handleUpdateSort}
      defaultSort={sortBy}
      defaultSortDirection={getTableSortOrder(sort)}
      sortable
      emptyStateMsg="No users available"
    />
  );
};

export default UserList;
