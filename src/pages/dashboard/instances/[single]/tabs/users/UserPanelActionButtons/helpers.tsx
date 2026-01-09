import type { User } from "@/types/User";
import { pluralize } from "@/utils/_helpers";
import type { ReactNode } from "react";

export enum UserAction {
  Lock = "lock",
  Unlock = "unlock",
}

export const getSelectedUsernames = (users: User[]): string[] => {
  return users.map((user) => user.username);
};

const getSingleUserMessage = (userAction: UserAction): string => {
  switch (userAction) {
    case UserAction.Lock:
      return `This will prevent this user from logging into this account without
      deleting the files belonging to the account.`;
    case UserAction.Unlock:
      return "This will restore login access for the user.";
    default:
      return "";
  }
};

const getUsersWithSameStateMessage = (userAction: UserAction): string => {
  switch (userAction) {
    case UserAction.Lock:
      return "This will prevent users from logging into these accounts without deleting the files belonging to the accounts.";
    case UserAction.Unlock:
      return "This will restore login access for the users of these accounts.";
    default:
      return "";
  }
};

const capitalize = <T extends string>(s: T) =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export const formatCountableNoun = ({
  count,
  singular,
  plural = `${singular}s`,
}: {
  count: number;
  singular: string;
  plural?: string;
}) => (
  <span>
    <strong>{count}</strong> {pluralize(count, singular, plural)}
  </span>
);

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
    return <p>{getSingleUserMessage(userAction)}</p>;
  } else if (
    (userAction === UserAction.Lock && lockedCount === 0) ||
    (userAction === UserAction.Unlock && unlockedCount === 0)
  ) {
    return <p>{getUsersWithSameStateMessage(userAction)}</p>;
  } else {
    return (
      <>
        <p>{capitalize(userAction)}ing users removes their login access.</p>
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
