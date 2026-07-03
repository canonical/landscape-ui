import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import UsersEmptyState from "./UsersEmptyState";

describe("UsersEmptyState", () => {
  it("renders the empty state message", () => {
    render(<UsersEmptyState onAddUser={vi.fn()} />);

    expect(screen.getByText("No users found")).toBeInTheDocument();
    expect(
      screen.getByText("Add new users by clicking the button below."),
    ).toBeInTheDocument();
  });

  it("calls onAddUser when the button is clicked", async () => {
    const handleAddUser = vi.fn();
    render(<UsersEmptyState onAddUser={handleAddUser} />);

    await userEvent.click(screen.getByRole("button", { name: "Add user" }));

    expect(handleAddUser).toHaveBeenCalledTimes(1);
  });
});
