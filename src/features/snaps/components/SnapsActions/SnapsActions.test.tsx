import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import { getSelectedSnaps } from "../../helpers";
import SnapsActions from "./SnapsActions";

const snapData = {
  empty: [],
  single: {
    unheldSnap:
      installedSnaps.find((snap) => snap.held_until === null)?.snap.id ?? "",
    heldSnap:
      installedSnaps.find((snap) => snap.held_until !== null)?.snap.id ?? "",
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
  beforeEach(() => {
    setScreenSize("lg");
  });

  afterEach(() => {
    resetScreenSize();
  });

  describe("Snap buttons in table", () => {
    it("renders table buttons", () => {
      const { container } = renderWithProviders(
        <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
          selectedSnapIds={snapData.empty}
        />,
      );

      expect(container).toHaveTexts(tableSnapButtons);
    });

    describe("Check button disabled statuses", () => {
      it("renders disabled buttons when no snaps selected", () => {
        renderWithProviders(
          <SnapsActions
            installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
            selectedSnapIds={snapData.empty}
          />,
        );

        for (const button of tableSnapButtons) {
          const actionButton = screen.getByRole("button", { name: button });
          if (button !== "Install") {
            expect(actionButton).toHaveAttribute("aria-disabled");
          } else {
            expect(actionButton).not.toHaveAttribute("aria-disabled");
            expect(actionButton).toBeEnabled();
          }
        }
      });

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
        expect(unholdButton).toHaveAttribute("aria-disabled");
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
        expect(holdButton).toHaveAttribute("aria-disabled");
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
        expect(unholdButton).not.toHaveAttribute("aria-disabled");
        expect(holdButton).not.toHaveAttribute("aria-disabled");
        expect(unholdButton).toBeEnabled();
        expect(holdButton).toBeEnabled();
      });
    });
  });

  describe("Snap buttons in sidepanel", () => {
    it("renders correct buttons for held snap in sidepanel", () => {
      const { container } = renderWithProviders(
        <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, [
            snapData.single.heldSnap,
          ])}
          selectedSnapIds={[snapData.single.heldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formHeldSnapButtons);
    });

    it("renders correct buttons for unheld snap in sidepanel", () => {
      const { container } = renderWithProviders(
        <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, [
            snapData.single.unheldSnap,
          ])}
          selectedSnapIds={[snapData.single.unheldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formUnheldSnapButtons);
    });
  });
});
