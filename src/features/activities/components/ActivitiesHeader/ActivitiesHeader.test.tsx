import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ComponentProps } from "react";
import ActivitiesHeader from "./ActivitiesHeader";

const props: ComponentProps<typeof ActivitiesHeader> = {
  selected: [],
  resetSelectedIds: vi.fn(),
};

describe("ActivitiesHeader", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    renderWithProviders(<ActivitiesHeader {...props} />);
  });

  it("should render without crashing", () => {
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    expect(searchBox).toBeInTheDocument();
  });

  it("should display search help when help button is clicked", async () => {
    const helpButton = screen.getByRole("button", { name: /help/i });
    expect(helpButton).toBeInTheDocument();

    await user.click(helpButton);

    const searchHelpDialog = screen.getByRole("dialog", {
      name: /search help/i,
    });
    expect(searchHelpDialog).toBeInTheDocument();
  });

  it("should render filters", () => {
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/type/i)).toBeInTheDocument();

    const dateFilterButton = screen.getByRole("button", { name: /date/i });
    expect(dateFilterButton).toBeInTheDocument();
  });

  it("should allow typing in search box", async () => {
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    await user.type(searchBox, "test activity");
    expect(searchBox).toHaveValue("test activity");
  });

  it("should clear search box when clear button is clicked", async () => {
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    await user.type(searchBox, "test");

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await user.click(clearButton);

    expect(searchBox).toHaveValue("");
  });
});
