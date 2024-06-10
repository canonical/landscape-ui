import "@/tests/matcher";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import SnapsActions from "./SnapsActions";
import { renderWithProviders } from "@/tests/render";
import { installedSnaps } from "@/tests/mocks/snap";
import { getSelectedSnaps } from "../helpers";

const snapData = {
  empty: [],
  single: {
    unheldSnap: installedSnaps.find((snap) => snap.held_until === null)!.snap
      .id,
    heldSnap: installedSnaps.find((snap) => snap.held_until !== null)!.snap.id,
  },
  multiple: {
    unheldSnaps: installedSnaps
      .filter((snap) => snap.held_until === null)
      .map((snap) => snap.snap.id),
    heldSnaps: installedSnaps
      .filter((snap) => snap.held_until !== null)
      .map((snap) => snap.snap.id),
  },
};

const mixedSelectedSnapIds = [
  ...snapData.multiple.heldSnaps,
  ...snapData.multiple.unheldSnaps,
];

const tableSnapButtons = ["Install", "Hold", "Unhold", "Uninstall", "Refresh"];
const formHeldSnapButtons = [
  "Unhold",
  "Uninstall",
  "Refresh",
  "Switch channel",
];
const formUnheldSnapButtons = [
  "Hold",
  "Uninstall",
  "Refresh",
  "Switch channel",
];

describe("SnapsActions", () => {
  describe("Snap buttons in table", () => {
    it.each(tableSnapButtons)("renders %s button", async (button) => {
      renderWithProviders(
        <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
          selectedSnapIds={snapData.empty}
        />,
      );
      const actionButton = await screen.findByRole("button", {
        name: button,
      });
      expect(actionButton).toBeInTheDocument();
    });

    describe("Check button disabled statuses", () => {
      it.each(tableSnapButtons)(
        "renders disabled %s button when no snaps selected",
        async (button) => {
          renderWithProviders(
            <SnapsActions
              installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
              selectedSnapIds={snapData.empty}
            />,
          );
          const actionButton = await screen.findByRole("button", {
            name: button,
          });
          if (button !== "Install") {
            expect(actionButton).toBeDisabled();
          } else {
            expect(actionButton).toBeEnabled();
          }
        },
      );

      it("Unhold button disabled when only unheld snaps are selected", () => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              snapData.multiple.unheldSnaps,
            )}
            selectedSnapIds={snapData.multiple.unheldSnaps}
          />,
        );
        const unholdButton = screen.getByRole("button", { name: "Unhold" });
        expect(unholdButton).toBeDisabled();
      });

      it("Hold button disabled when only held snaps are selected", () => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              snapData.multiple.heldSnaps,
            )}
            selectedSnapIds={snapData.multiple.heldSnaps}
          />,
        );
        const holdButton = screen.getByRole("button", { name: "Hold" });
        expect(holdButton).toBeDisabled();
      });

      it("Hold and Unhold enabled when only held and unheld snaps are selected", () => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              mixedSelectedSnapIds,
            )}
            selectedSnapIds={mixedSelectedSnapIds}
          />,
        );
        const holdButton = screen.getByRole("button", { name: "Hold" });
        const unholdButton = screen.getByRole("button", { name: "Unhold" });
        expect(unholdButton).toBeEnabled();
        expect(holdButton).toBeEnabled();
      });
    });
  });

  describe("Snap buttons in sidepanel", () => {
    it.each(formHeldSnapButtons)(
      "Renders %s button for held snap in sidepanel",
      async (button) => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(installedSnaps, [
              snapData.single.heldSnap,
            ])}
            selectedSnapIds={[snapData.single.heldSnap]}
            sidePanel={true}
          />,
        );
        const actionButton = await screen.findByRole("button", {
          name: button,
        });
        expect(actionButton).toBeInTheDocument();
      },
    );

    it.each(formUnheldSnapButtons)(
      "Renders %s button for unheld snap in sidepanel",
      async (button) => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(installedSnaps, [
              snapData.single.unheldSnap,
            ])}
            selectedSnapIds={[snapData.single.unheldSnap]}
            sidePanel={true}
          />,
        );
        const actionButton = await screen.findByRole("button", {
          name: button,
        });
        expect(actionButton).toBeInTheDocument();
      },
    );
  });
});
