import { availableSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import SnapDropdownSearch from "./SnapDropdownSearch";
import { PATHS } from "@/libs/routes";

const props = {
  selectedItems: [],
  setSelectedItems: vi.fn(),
  setConfirming: vi.fn(),
};

describe("SnapDropdownSearch", () => {
  beforeEach(async () => {
    renderWithProviders(
      <SnapDropdownSearch {...props} />,
      {},
      "/instances/1",
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );
  });

  it("renders snap dropdown search component", () => {
    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
  });

  describe("snap selection flow", () => {
    it("shows matching snaps after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "Snap 1");
      expect(searchBox).toHaveValue("Snap 1");

      const snaps = await screen.findAllByText("Snap 1");
      const matchingSnaps = availableSnaps.filter((snap) =>
        snap.name.includes("Snap 1"),
      );
      //expected length 2, since Snap 1 and Snap 11 should be returned
      expect(snaps).toHaveLength(matchingSnaps.length);
    });

    it("shows error if no matching snap found", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "checking for error");
      expect(searchBox).toHaveValue("checking for error");

      const errorText = await screen.findByText(/No snaps found by/i);
      expect(errorText).toBeVisible();
    });

    it("reopens search dropdown after canceling a snap addition", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "Snap 2");
      expect(searchBox).toHaveValue("Snap 2");

      const snap = await screen.findByText("Snap 2");
      expect(snap).toBeInTheDocument();

      await userEvent.click(snap);
      const form = await screen.findByRole("form");
      expect(form).not.toBeNull();
      const cancelButton = within(form).getByRole("button", {
        name: /cancel/i,
      });

      expect(cancelButton).toBeInTheDocument();

      await userEvent.click(cancelButton);
      const helperText = screen.queryByText(/min 3. characters/i);
      expect(helperText).not.toBeInTheDocument();

      expect(searchBox.focus).toBeTruthy();

      const reappearingSnap = await screen.findByText("Snap 2");
      expect(reappearingSnap).toBeInTheDocument();
    });
  });
});
