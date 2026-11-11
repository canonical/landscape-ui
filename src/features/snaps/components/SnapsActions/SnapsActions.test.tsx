import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { afterEach, assert, beforeEach, describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
import SnapsActions from "./SnapsActions";

const snapData = {
  empty: [],
  single: {
    unheldSnap: installedSnaps.find((snap) => snap.held_until === null),
    heldSnap: installedSnaps.find((snap) => snap.held_until !== null),
  },
  multiple: {
    unheldSnaps: installedSnaps.filter((snap) => snap.held_until === null),
    heldSnaps: installedSnaps.filter((snap) => snap.held_until !== null),
  },
};

const mixedSelectedSnaps = [
  ...snapData.multiple.heldSnaps,
  ...snapData.multiple.unheldSnaps,
];
const INSTANCE_ID = 11;

const tableSnapButtons = ["Install", "Hold", "Unhold", "Uninstall", "Refresh"];
const formHeldSnapButtons = [
  "Unhold",
  "Uninstall",
  "Refresh",
  "Change channel",
];
const formUnheldSnapButtons = [
  "Hold",
  "Uninstall",
  "Refresh",
  "Change channel",
];

const renderOnInstancePage = (element: ReactElement) =>
  renderWithProviders(
    element,
    undefined,
    ROUTES.instances.details.single(INSTANCE_ID),
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("SnapsActions", () => {
  beforeEach(() => {
    setScreenSize("lg");
  });

  afterEach(() => {
    resetScreenSize();
  });

  describe("Snap buttons in table", () => {
    it("renders table buttons with the bulk menu's icons", () => {
      const { container } = renderWithProviders(
        <SnapsActions selectedSnaps={snapData.empty} />,
      );

      expect(container).toHaveTexts(tableSnapButtons);
      expect(screen.getByRole("button", { name: "Install" })).toHaveIcon(
        "import",
      );
      expect(screen.getByRole("button", { name: "Uninstall" })).toHaveIcon(
        "close",
      );
      expect(screen.getByRole("button", { name: "Refresh" })).toHaveIcon(
        "restart",
      );
      expect(screen.getByRole("button", { name: "Hold" })).toHaveIcon("pause");
      expect(screen.getByRole("button", { name: "Unhold" })).toHaveIcon("play");
    });

    describe("Check button disabled statuses", () => {
      it("renders disabled buttons when no snaps selected", () => {
        renderWithProviders(<SnapsActions selectedSnaps={snapData.empty} />);

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
          <SnapsActions selectedSnaps={snapData.multiple.unheldSnaps} />,
        );
        const unholdButton = screen.getByRole("button", { name: "Unhold" });
        expect(unholdButton).toHaveAttribute("aria-disabled");
      });

      it("Hold button disabled when only held snaps are selected", () => {
        renderWithProviders(
          <SnapsActions selectedSnaps={snapData.multiple.heldSnaps} />,
        );
        const holdButton = screen.getByRole("button", { name: "Hold" });
        expect(holdButton).toHaveAttribute("aria-disabled");
      });

      it("Hold and Unhold enabled when only held and unheld snaps are selected", () => {
        renderWithProviders(
          <SnapsActions selectedSnaps={mixedSelectedSnaps} />,
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
      assert(snapData.single.heldSnap);
      const { container } = renderOnInstancePage(
        <SnapsActions
          selectedSnaps={[snapData.single.heldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formHeldSnapButtons);
    });

    it("renders correct buttons for unheld snap in sidepanel", () => {
      assert(snapData.single.unheldSnap);
      const { container } = renderOnInstancePage(
        <SnapsActions
          selectedSnaps={[snapData.single.unheldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formUnheldSnapButtons);
    });

    it("does not render change channel button for multiple snaps in sidepanel", () => {
      renderWithProviders(
        <SnapsActions selectedSnaps={mixedSelectedSnaps} sidePanel={true} />,
      );

      expect(
        screen.queryByRole("button", { name: "Change channel" }),
      ).not.toBeInTheDocument();
    });

    it("enables the change channel button without waiting for snap info", () => {
      assert(snapData.single.unheldSnap);
      renderOnInstancePage(
        <SnapsActions
          selectedSnaps={[snapData.single.unheldSnap]}
          sidePanel={true}
        />,
      );

      const button = screen.getByRole("button", { name: "Change channel" });
      expect(button).not.toHaveAttribute("aria-disabled");
      expect(button).toBeEnabled();
      expect(button).toHaveIcon("change-version");
    });

    it("opens install snaps side panel from table actions", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SnapsActions selectedSnaps={snapData.empty} />);

      await user.click(screen.getByRole("button", { name: "Install" }));

      expect(
        await screen.findByRole("heading", { name: "Install snaps" }),
      ).toBeInTheDocument();
    });

    it("opens hold side panel for the unheld snaps only", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(<SnapsActions selectedSnaps={mixedSelectedSnaps} />);

      await user.click(screen.getByRole("button", { name: "Hold" }));

      expect(
        await screen.findByRole("heading", { name: "Hold snaps" }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", {
          name: `Hold ${snapData.multiple.unheldSnaps.length} snaps`,
        }),
      ).toBeInTheDocument();
      for (const snap of snapData.multiple.unheldSnaps) {
        expect(screen.getByText(snap.snap.name)).toBeInTheDocument();
      }
      for (const snap of snapData.multiple.heldSnaps) {
        expect(screen.queryByText(snap.snap.name)).not.toBeInTheDocument();
      }
    });

    it("opens uninstall side panel for selected snaps", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(
        <SnapsActions selectedSnaps={snapData.multiple.unheldSnaps} />,
      );

      await user.click(screen.getByRole("button", { name: "Uninstall" }));

      expect(
        await screen.findByRole("heading", { name: "Uninstall snaps" }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", {
          name: `Uninstall ${snapData.multiple.unheldSnaps.length} snaps`,
        }),
      ).toBeInTheDocument();
    });

    it("opens unhold side panel for the held snaps only", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(<SnapsActions selectedSnaps={mixedSelectedSnaps} />);

      await user.click(screen.getByRole("button", { name: "Unhold" }));

      expect(
        await screen.findByRole("heading", { name: "Unhold snaps" }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", {
          name: `Unhold ${snapData.multiple.heldSnaps.length} snaps`,
        }),
      ).toBeInTheDocument();
    });

    it("opens refresh side panel for selected snaps", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(
        <SnapsActions selectedSnaps={snapData.multiple.unheldSnaps} />,
      );

      await user.click(screen.getByRole("button", { name: "Refresh" }));

      expect(
        await screen.findByRole("heading", { name: "Refresh snaps" }),
      ).toBeInTheDocument();
    });

    it("opens change channel side panel for a single snap in sidepanel mode", async () => {
      const user = userEvent.setup();
      assert(snapData.single.heldSnap);
      renderOnInstancePage(
        <SnapsActions
          selectedSnaps={[snapData.single.heldSnap]}
          sidePanel={true}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Change channel" }));

      expect(
        await screen.findByRole("heading", { name: "Change snap channel" }),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(snapData.single.heldSnap.snap.name),
      ).toBeInTheDocument();
    });

    it("uses a generic title for a single snap in sidepanel mode", async () => {
      const user = userEvent.setup();
      assert(snapData.single.heldSnap);
      renderOnInstancePage(
        <SnapsActions
          selectedSnaps={[snapData.single.heldSnap]}
          sidePanel={true}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Uninstall" }));

      expect(
        await screen.findByRole("heading", { name: "Uninstall snaps" }),
      ).toBeInTheDocument();
    });
  });
});
