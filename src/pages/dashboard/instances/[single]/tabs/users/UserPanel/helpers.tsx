import {
  MainTableHeader,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import { User } from "@/types/User";
import { Button, CheckboxInput } from "@canonical/react-components";
import classes from "./UserPanel.module.scss";
import { NOT_AVAILABLE } from "@/constants";

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
