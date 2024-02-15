import {
  MainTableHeader,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import { User } from "../../../../../../types/User";
import { Button, CheckboxInput } from "@canonical/react-components";
import classes from "./UserPanel.module.scss";
import { ReactNode } from "react";
import { NOT_AVAILABLE } from "../../../../../../constants";

export enum UserAction {
  Lock = "lock",
  Unlock = "unlock",
}

export const getSelectedUsers = (users: User[], selected: number[]): User[] => {
  return users.filter((user) => selected.includes(user.uid));
};

export const getSelectedUsernames = (users: User[]): string[] => {
  return users.map((user) => user.username);
};

export const getUserLockStatusCounts = (
  users: User[],
): { locked: number; unlocked: number } => {
  return users.reduce(
    (counts, user) => {
      counts.locked += user.enabled === false ? 1 : 0;
      counts.unlocked += user.enabled === true ? 1 : 0;
      return counts;
    },
    { locked: 0, unlocked: 0 },
  );
};

const getSingleUserMessage = (userAction: UserAction): string => {
  switch (userAction) {
    case UserAction.Lock:
      return `This will prevent this user from logging into this account without
      deleting the files belonging to the account`;
    case UserAction.Unlock:
      return `This will restore login access for the user`;
    default:
      return "";
  }
};

const getUsersWithSameStateMessage = (userAction: UserAction): string => {
  switch (userAction) {
    case UserAction.Lock:
      return "This will prevent users from logging into these accounts without deleting the files belonging to the accounts";
    case UserAction.Unlock:
      return "This will restore login access for the users of these accounts";
    default:
      return "";
  }
};

const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export const renderModalBody = ({
  user,
  selectedUsers,
  userAction,
}: {
  user: User | undefined;
  selectedUsers: User[];
  userAction: UserAction;
}): ReactNode => {
  const { locked: lockedCount, unlocked: unlockedCount } =
    getUserLockStatusCounts(selectedUsers);

  if (user) {
    return getSingleUserMessage(userAction);
  } else if (
    (userAction === UserAction.Lock && lockedCount === 0) ||
    (userAction === UserAction.Unlock && unlockedCount === 0)
  ) {
    return getUsersWithSameStateMessage(userAction);
  } else {
    return (
      <>
        <p>{capitalize(userAction)}ing users removes their login access</p>
        You selected{" "}
        {formatCountableNoun({ count: selectedUsers.length, singular: "user" })}
        . This will:
        <ul>
          <li>
            {userAction}{" "}
            {formatCountableNoun({
              count:
                userAction === UserAction.Lock ? unlockedCount : lockedCount,
              singular: "user",
            })}
          </li>
          <li>
            leave{" "}
            {formatCountableNoun({
              count:
                userAction === UserAction.Lock ? lockedCount : unlockedCount,
              singular: "user",
            })}{" "}
            {userAction}ed
          </li>
        </ul>
      </>
    );
  }
};

const formatCountableNoun = ({
  count,
  singular,
  plural = `${singular}s`,
}: {
  count: number;
  singular: string;
  plural?: string;
}) => (
  <span>
    <strong>{count}</strong> {count === 1 ? singular : plural}
  </span>
);

export const getFilteredUsers = (searchText: string, users: User[]) => {
  return searchText
    ? users.filter(({ username, name }) => {
        const nameMatches = name
          .toUpperCase()
          .includes(searchText.toUpperCase());
        const usernameMatches = username
          .toUpperCase()
          .includes(searchText.toUpperCase());
        return nameMatches || usernameMatches;
      })
    : users;
};

export const getHeaders = (
  selectedLength: number,
  usersLength: number,
  onChange: () => void,
): MainTableHeader[] => {
  return [
    {
      content: (
        <>
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all</span>}
            checked={selectedLength === usersLength && usersLength > 0}
            onChange={onChange}
            indeterminate={selectedLength > 0 && selectedLength < usersLength}
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
};

export const getRows = (
  users: User[],
  selected: number[],
  setSelected: (value: number[] | ((prevState: number[]) => number[])) => void,
  handleEditUser: (user: User) => void,
  handleShowUserDetails: (user: User) => void,
): MainTableRow[] => {
  return users.map((user) => {
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
                onChange={() => {
                  setSelected((prevState: number[]) => {
                    return prevState.includes(user.uid)
                      ? prevState.filter(
                          (prevStateUid) => prevStateUid !== user.uid,
                        )
                      : [...prevState, user.uid];
                  });
                }}
              />
              <Button
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top"
                onClick={() => {
                  handleShowUserDetails(user);
                }}
                aria-label={`User ${user.username} details`}
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
          "aria-label": "status",
        },
        { content: user.uid, "aria-label": "uid" },
        {
          content: user.name !== "" ? user.name : NOT_AVAILABLE,
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
};
