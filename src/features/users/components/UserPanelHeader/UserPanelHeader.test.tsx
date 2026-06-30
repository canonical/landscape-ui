import { describe, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserPanelHeader from "./UserPanelHeader";
import { renderWithProviders } from "@/tests/render";

const props = {
  users: [],
  selected: [],
  handleClearSelection: vi.fn(),
};

describe("UserPanelHeader", () => {
  beforeEach(() => {
    renderWithProviders(<UserPanelHeader {...props} />);
  });

  it("renders UserPanelHeader correctly", () => {
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("should write in search", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
  });

  it("should clear search box", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test");
    await userEvent.click(
      screen.getByRole("button", { name: /Clear search field/i }),
    );
    expect(searchBox).toHaveValue("");
  });
});
