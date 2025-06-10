import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import SnapsPanel from "./SnapsPanel";

describe("SnapsPanel", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<SnapsPanel />);
    await expectLoadingState();

    const emptyStateTitle = await screen.findByText(
      "You haven't installed any snaps yet",
    );
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("opens form from empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<SnapsPanel />);
    await expectLoadingState();

    const installSnapButton = await screen.findByRole("button", {
      name: /install snaps/i,
    });
    expect(installSnapButton).toBeInTheDocument();

    await userEvent.click(installSnapButton);
    const form = await screen.findByRole("complementary");
    expect(form).toBeInTheDocument();
  });

  it("renders filtered list of installed snaps", async () => {
    renderWithProviders(<SnapsPanel />);
    await expectLoadingState();

    for (const installedSnap of installedSnaps) {
      const snap = await screen.findByRole("button", {
        name: `Show details of snap ${installedSnap.snap.name}`,
      });
      expect(snap).toBeInTheDocument();
    }
    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${installedSnaps[0].snap.name}{enter}`);
    const snapFound = await screen.findByRole("button", {
      name: `Show details of snap ${installedSnaps[0].snap.name}`,
    });
    const removedSnap = screen.queryByRole("button", {
      name: `Show details of snap ${installedSnaps[1].snap.name}`,
    });
    expect(snapFound).toBeInTheDocument();
    expect(removedSnap).not.toBeInTheDocument();
  });
});
