import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { users } from "@/tests/mocks/user";
import {
  UserAction,
  getSelectedUsernames,
  getUserLockStatusCounts,
  renderModalBody,
} from "./helpers";

describe("UserPanelActionButtons helpers", () => {
  it("returns selected usernames", () => {
    expect(getSelectedUsernames(users.slice(0, 3))).toEqual([
      "user1",
      "user2",
      "user3",
    ]);
  });

  it("counts locked and unlocked users", () => {
    expect(getUserLockStatusCounts(users.slice(0, 5))).toEqual({
      locked: 2,
      unlocked: 3,
    });
  });

  it("renders single-user copy when a specific user is provided", () => {
    const node = renderModalBody({
      user: users[0],
      selectedUsers: [users[0]],
      userAction: UserAction.Lock,
    });

    render(<>{node}</>);

    expect(
      screen.getByText(/prevent this user from logging into this account/i),
    ).toBeInTheDocument();
  });

  it("renders same-state copy when all selected users are unlocked and lock is requested", () => {
    const selectedUsers = users.filter((user) => user.enabled);

    const node = renderModalBody({
      user: undefined,
      selectedUsers,
      userAction: UserAction.Lock,
    });

    render(<>{node}</>);

    expect(
      screen.getByText(/prevent users from logging into these accounts/i),
    ).toBeInTheDocument();
  });

  it("renders mixed-state summary with hold/leave counts", () => {
    const selectedUsers = users.slice(0, 4);

    const node = renderModalBody({
      user: undefined,
      selectedUsers,
      userAction: UserAction.Lock,
    });

    const { container } = render(<>{node}</>);

    expect(
      screen.getByText(/locking users removes their login access/i),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent("You selected 4 users.");
    expect(container).toHaveTextContent("lock 3 users");
    expect(container).toHaveTextContent("leave 1 user locked");
  });

  it("renders unlock copy for a specific user", () => {
    const lockedUser = users.find((user) => !user.enabled);
    assert(lockedUser);

    const node = renderModalBody({
      user: lockedUser,
      selectedUsers: [lockedUser],
      userAction: UserAction.Unlock,
    });

    render(<>{node}</>);

    expect(
      screen.getByText(/restore login access for the user/i),
    ).toBeInTheDocument();
  });

  it("renders same-state copy when all selected users are locked and unlock is requested", () => {
    const selectedUsers = users.filter((user) => !user.enabled);

    const node = renderModalBody({
      user: undefined,
      selectedUsers,
      userAction: UserAction.Unlock,
    });

    render(<>{node}</>);

    expect(
      screen.getByText(/restore login access for the users of these accounts/i),
    ).toBeInTheDocument();
  });

  it("returns an empty node for unknown actions", () => {
    const node = renderModalBody({
      user: users[0],
      selectedUsers: [users[0]],
      userAction: "unknown" as UserAction,
    });

    const { container } = render(<>{node}</>);
    expect(container).toHaveTextContent("");
  });

  it("renders mixed-state summary for unlock action", () => {
    const selectedUsers = users.slice(0, 4);

    const node = renderModalBody({
      user: undefined,
      selectedUsers,
      userAction: UserAction.Unlock,
    });

    const { container } = render(<>{node}</>);

    expect(
      screen.getByText(/unlocking users removes their login access/i),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent("You selected 4 users.");
    expect(container).toHaveTextContent("unlock 1 user");
    expect(container).toHaveTextContent("leave 3 users unlocked");
  });
});
