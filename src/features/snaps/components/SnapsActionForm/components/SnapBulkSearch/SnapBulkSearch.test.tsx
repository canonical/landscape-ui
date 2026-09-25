import { setEndpointStatus } from "@/tests/controllers/controller";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { ErrorBoundary } from "@sentry/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SnapBulkSearch from "./SnapBulkSearch";
import { MAX_SELECTED_SNAPS } from "./constants";

const [firstSnap, secondSnap, , , , , , , , , searchedSnap] = installedSnaps;

const props: ComponentProps<typeof SnapBulkSearch> = {
  instanceIds: [1],
  selectedItems: [],
  setSelectedItems: vi.fn(),
  action: "uninstall",
};

describe("SnapBulkSearch", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows snaps matching the search term", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, searchedSnap.snap.name);

    expect(await screen.findByText(searchedSnap.snap.name)).toBeInTheDocument();
  });

  it("adds snap to selection when clicked", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    await user.click(screen.getByRole("searchbox"));

    const suggestion = await screen.findByRole("option", {
      name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
    });
    await user.click(suggestion);

    expect(props.setSelectedItems).toHaveBeenCalledWith([firstSnap]);
  });

  it("clears search after selecting a package", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, searchedSnap.snap.name);

    const suggestion = await screen.findByRole("option", {
      name: `${searchedSnap.snap.name} ${searchedSnap.snap.publisher.username}`,
    });
    await user.click(suggestion);

    expect(searchBox).toHaveValue("");
  });

  it("clears search input when clear button is clicked", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");
    expect(searchBox).toHaveValue("test");

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await user.click(clearButton);

    expect(searchBox).toHaveValue("");
  });

  it("throws error if snaps query fails", async () => {
    setEndpointStatus({ path: "/snaps", status: "error" });

    renderWithProviders(
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <SnapBulkSearch {...props} />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole("searchbox"));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows warning when the snap limit is reached", () => {
    renderWithProviders(
      <SnapBulkSearch
        {...props}
        selectedItems={installedSnaps.slice(0, MAX_SELECTED_SNAPS)}
      />,
    );

    expect(
      screen.getByText(
        `You can only uninstall a maximum of ${MAX_SELECTED_SNAPS} snaps at once.`,
      ),
    ).toBeInTheDocument();
  });

  it("shows the right phrasing for the change channel limit warning", () => {
    renderWithProviders(
      <SnapBulkSearch
        {...props}
        action={"change channel"}
        selectedItems={installedSnaps.slice(0, MAX_SELECTED_SNAPS)}
      />,
    );

    expect(
      screen.getByText(/You can only change channels on a maximum of/i),
    ).toBeInTheDocument();
  });

  it("searches available snaps when the action is install", () => {
    renderWithProviders(<SnapBulkSearch {...props} action="install" />);

    expect(
      screen.getByPlaceholderText("Search available snaps"),
    ).toBeInTheDocument();
  });

  it("searches held snaps when the action is unhold", () => {
    renderWithProviders(<SnapBulkSearch {...props} action="unhold" />);

    expect(
      screen.getByPlaceholderText("Search held snaps"),
    ).toBeInTheDocument();
  });

  it("closes the dropdown when Escape is pressed", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    await user.click(screen.getByRole("searchbox"));

    expect(await screen.findByText(firstSnap.snap.name)).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByText(firstSnap.snap.name)).not.toBeInTheDocument();
  });

  it("reopens the closed dropdown when Enter is pressed", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    await user.click(screen.getByRole("searchbox"));

    expect(await screen.findByText(firstSnap.snap.name)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText(firstSnap.snap.name)).not.toBeInTheDocument();

    await user.keyboard("{Enter}");

    expect(await screen.findByText(firstSnap.snap.name)).toBeInTheDocument();
  });

  it("scrolls the dropdown when using arrow keys", async () => {
    renderWithProviders(<SnapBulkSearch {...props} />);

    await user.click(screen.getByRole("searchbox"));

    const firstSnapElement = await screen.findByRole("option", {
      name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
    });
    const secondSnapElement = await screen.findByRole("option", {
      name: `${secondSnap.snap.name} ${secondSnap.snap.publisher.username}`,
    });

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    expect(secondSnapElement).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowUp}");
    expect(firstSnapElement).toHaveAttribute("aria-selected", "true");
  });
});
