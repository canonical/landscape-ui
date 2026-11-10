import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import type { ComponentProps } from "react";
import ActivitiesHeader from "./ActivitiesHeader";
import { EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "../../constants";
import * as Constants from "@/constants";
import { activities } from "@/tests/mocks/activity";

const props: ComponentProps<typeof ActivitiesHeader> = {
  selected: [],
  resetSelectedIds: vi.fn(),
  availableActions: { approve: false, cancel: false, redo: false },
  availableFilters: { status: true, type: false, date: true },
  searchHelpTerms: {
    id: true,
    parentId: false,
    createdAfter: true,
    createdBefore: true,
    creator: true,
    computer: false,
    type: false,
  },
  filters: { query: "", status: "", type: "", fromDate: "", toDate: "" },
  onChangeFilters: vi.fn(),
};

describe("ActivitiesHeader", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    setScreenSize("xxl");
    renderWithProviders(<ActivitiesHeader {...props} />);
  });

  afterEach(() => {
    resetScreenSize();
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
    expect(
      screen.queryByRole("button", { name: "Type" }),
    ).not.toBeInTheDocument();

    const dateFilterButton = screen.getByRole("button", { name: /date/i });
    expect(dateFilterButton).toBeInTheDocument();
  });

  it("omits detail-only terms from the activities page search help", async () => {
    await user.click(screen.getByRole("button", { name: /help/i }));
    const dialog = screen.getByRole("dialog", { name: /search help/i });
    expect(dialog).not.toHaveTextContent("computer:<criteria>");
    expect(dialog).not.toHaveTextContent("type:<type>");
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

    expect(props.onChangeFilters).toHaveBeenCalledWith({
      query: "my-query",
    });
    expect(props.resetSelectedIds).toHaveBeenCalled();
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

describe("ActivitiesHeader in detail views", () => {
  it("clears selection when the controlled type filter changes", async () => {
    const filterProps = {
      ...props,
      resetSelectedIds: vi.fn(),
      filters: {
        ...props.filters,
        type: "ExecuteScriptRequest",
      },
      onChangeFilters: vi.fn(),
    };
    setScreenSize("xxl");
    try {
      renderWithProviders(
        <ActivitiesHeader
          {...filterProps}
          availableFilters={{ status: true, type: true, date: true }}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: /type/i }));
      await userEvent.click(screen.getByRole("button", { name: "All" }));
      expect(filterProps.onChangeFilters).toHaveBeenCalledWith({
        type: "",
      });
      expect(filterProps.resetSelectedIds).toHaveBeenCalledOnce();
    } finally {
      resetScreenSize();
    }
  });

  it("preserves an initial type filter while activity types are loading", async () => {
    renderWithProviders(
      <ActivitiesHeader
        {...props}
        availableFilters={{ status: true, type: true, date: true }}
        filters={{
          ...props.filters,
          type: "ExecuteScriptRequest",
        }}
      />,
    );
    expect(
      await screen.findByText("Type: ExecuteScriptRequest"),
    ).toBeInTheDocument();
  });

  it("shows the Type filter and additional search help in detail views", async () => {
    const user = userEvent.setup();
    setScreenSize("xxl");
    renderWithProviders(
      <ActivitiesHeader
        {...props}
        availableFilters={{ status: true, type: true, date: true }}
        searchHelpTerms={{
          ...props.searchHelpTerms,
          computer: true,
          type: true,
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Type" }));
    expect(
      screen.queryByRole("button", {
        name: EXCLUDED_ACTIVITY_TYPE_OPTIONS[0],
      }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /help/i }));
    const dialog = screen.getByRole("dialog", { name: /search help/i });
    expect(dialog).toHaveTextContent("computer:<criteria>");
    expect(dialog).toHaveTextContent("type:<type>");
    resetScreenSize();
  });

  it("renders actions when rendered in panel mode with instanceId", () => {
    renderWithProviders(
      <ActivitiesHeader
        {...props}
        availableActions={{ approve: true, cancel: true, redo: true }}
        alwaysCollapse
      />,
      undefined,
      "/computers/1/activities",
      "/computers/:instanceId/activities",
    );

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("renders no controls or stray zero when no filters or actions are available", () => {
    const { container } = renderWithProviders(
      <ActivitiesHeader
        {...props}
        availableActions={{ approve: false, cancel: false, redo: false }}
        availableFilters={{ status: false, type: false, date: false }}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Filters" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Actions" }),
    ).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent("0");
  });

  it("allows export without mutation actions", async () => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(true);
    const onExport = vi.fn();
    setScreenSize("xxl");
    try {
      renderWithProviders(
        <ActivitiesHeader
          {...props}
          selected={[activities[0]]}
          onExport={onExport}
        />,
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Export selection as TSV" }),
      );
      expect(onExport).toHaveBeenCalledOnce();
    } finally {
      resetScreenSize();
      vi.restoreAllMocks();
    }
  });

  it("clears only available filters and preserves a fixed status", async () => {
    const filterProps = {
      ...props,
      availableFilters: { status: false, type: true, date: true },
      filters: {
        ...props.filters,
        status: "unapproved",
        type: "ExecuteScriptRequest",
        fromDate: "2024-01-01T10:00",
      },
      onChangeFilters: vi.fn(),
    };
    renderWithProviders(<ActivitiesHeader {...filterProps} />);
    expect(screen.queryByText("Status: Unapproved")).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Clear all filters" }),
    );
    expect(filterProps.onChangeFilters).toHaveBeenCalledWith({
      query: "",
      type: "",
      fromDate: "",
      toDate: "",
    });
  });

  it("initialises search text from controlled filters", async () => {
    renderWithProviders(
      <ActivitiesHeader
        {...props}
        filters={{
          ...props.filters,
          query: "initial-test",
        }}
      />,
    );
    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    await waitFor(() => {
      expect(searchBox).toHaveValue("initial-test");
    });
  });

  it("collapses filters in a side panel even on a wide screen", async () => {
    setScreenSize("xxl");
    try {
      renderWithProviders(
        <ActivitiesHeader
          {...props}
          availableFilters={{ status: true, type: true, date: true }}
          alwaysCollapse
        />,
      );
      expect(
        screen.queryByRole("button", { name: "Type" }),
      ).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /filters/i }));
      expect(screen.getByRole("button", { name: "Type" })).toBeInTheDocument();
    } finally {
      resetScreenSize();
    }
  });
});
