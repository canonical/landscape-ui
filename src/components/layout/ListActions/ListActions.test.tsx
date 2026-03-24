import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ListActions from "./ListActions";
import type { Action } from "@/types/Action";

const actions: Action[] = [{ icon: "edit", label: "Edit", onClick: vi.fn() }];

describe("ListActions", () => {
  it("renders the toggle button", () => {
    renderWithProviders(<ListActions actions={actions} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows action labels when opened", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ListActions actions={actions} />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Edit")).toBeInTheDocument();
  });
});
