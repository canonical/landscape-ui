import { setEndpointStatus } from "@/tests/controllers/controller";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { ErrorBoundary } from "@sentry/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import assert from "assert";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SnapBulkSearch from "./SnapBulkSearch";
import { MAX_SELECTED_SNAPS } from "./constants";

const [, , searchedSnap] = installedSnaps;
assert(searchedSnap, "Need at least 3 mock snaps to exist");

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

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.type(searchBox, searchedSnap.snap.name);

    const suggestion = await screen.findByRole("option", {
      name: `${searchedSnap.snap.name} ${searchedSnap.snap.publisher.username}`,
    });
    await user.click(suggestion);

    expect(props.setSelectedItems).toHaveBeenCalledWith([searchedSnap]);
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
      screen.getByText(/You can only change channel on a maximum of/i),
    ).toBeInTheDocument();
  });
});
