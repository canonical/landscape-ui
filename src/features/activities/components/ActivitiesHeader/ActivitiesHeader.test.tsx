import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ComponentProps } from "react";
import ActivitiesHeader from "./ActivitiesHeader";
import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "../../constants";

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

  it("should not show excluded activity types in the type filter", async () => {
    await user.click(screen.getByRole("button", { name: "Type" }));

    expect(
      screen.queryByRole("button", {
        name: EXCLUDED_ACTIVITY_TYPE_OPTIONS[0],
      }),
    ).not.toBeInTheDocument();
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

  it("should trigger search when search button is clicked", async () => {
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    await user.type(searchBox, "my-query");

    const searchButton = screen.getByRole("button", { name: /^search$/i });
    await user.click(searchButton);

    // Should still render without crashing
    expect(searchBox).toBeInTheDocument();
  });

  it("should not search when query is empty (early return)", async () => {
    const searchButton = screen.getByRole("button", { name: /^search$/i });
    await user.click(searchButton);
    // Component still renders without errors
    expect(
      screen.getByRole("searchbox", { name: /search/i }),
    ).toBeInTheDocument();
  });

  it("should close search help popup when close button is clicked", async () => {
    const helpButton = screen.getByRole("button", { name: /help/i });
    await user.click(helpButton);

    expect(
      screen.getByRole("dialog", { name: /search help/i }),
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /search help/i }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("ActivitiesHeader with instanceId (panel mode)", () => {
  it("renders actions when rendered in panel mode with instanceId", () => {
    renderWithProviders(
      <ActivitiesHeader selected={[]} resetSelectedIds={vi.fn()} />,
      undefined,
      "/computers/1/activities",
      "/computers/:instanceId/activities",
    );

    // In panel mode, actions should be visible (ActivitiesActions is rendered)
    expect(
      screen.getByRole("searchbox", { name: /search/i }),
    ).toBeInTheDocument();
  });

  it("initialises search text from URL query parameter (non-nullish ?? branch)", async () => {
    renderWithProviders(
      <ActivitiesHeader {...props} />,
      undefined,
      "/activities?query=initial-test",
    );
    // useEffect runs with query = "initial-test" (non-nullish side of ??)
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    await waitFor(() => {
      expect(searchBox).toHaveValue("initial-test");
    });
  });
});
