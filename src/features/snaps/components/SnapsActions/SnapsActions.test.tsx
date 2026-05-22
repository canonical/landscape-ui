import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import LocationDisplay from "@/tests/LocationDisplay";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
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
const INSTANCE_ID = 11;

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
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
          selectedSnapIds={snapData.empty}
        />
          <LocationDisplay />
        </>,
      );

      expect(container).toHaveTexts(tableSnapButtons);
    });

    describe("Check button disabled statuses", () => {
      it("renders disabled buttons when no snaps selected", () => {
        renderWithProviders(
          <>
          <SnapsActions
            installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
            selectedSnapIds={snapData.empty}
          />
          <LocationDisplay />
        </>,
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
          <>
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              snapData.multiple.unheldSnaps,
            )}
            selectedSnapIds={snapData.multiple.unheldSnaps}
          />
          <LocationDisplay />
        </>,
        );
        const unholdButton = screen.getByRole("button", { name: "Unhold" });
        expect(unholdButton).toHaveAttribute("aria-disabled");
      });

      it("Hold button disabled when only held snaps are selected", () => {
        renderWithProviders(
          <>
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              snapData.multiple.heldSnaps,
            )}
            selectedSnapIds={snapData.multiple.heldSnaps}
          />
          <LocationDisplay />
        </>,
        );
        const holdButton = screen.getByRole("button", { name: "Hold" });
        expect(holdButton).toHaveAttribute("aria-disabled");
      });

      it("Hold and Unhold enabled when only held and unheld snaps are selected", () => {
        renderWithProviders(
          <>
          <SnapsActions
            installedSnaps={getSelectedSnaps(
              installedSnaps,
              mixedSelectedSnapIds,
            )}
            selectedSnapIds={mixedSelectedSnapIds}
          />
          <LocationDisplay />
        </>,
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
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, [
            snapData.single.heldSnap,
          ])}
          selectedSnapIds={[snapData.single.heldSnap]}
          sidePanel={true}
        />
          <LocationDisplay />
        </>,
      );

      expect(container).toHaveTexts(formHeldSnapButtons);
    });

    it("renders correct buttons for unheld snap in sidepanel", () => {
      const { container } = renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, [
            snapData.single.unheldSnap,
          ])}
          selectedSnapIds={[snapData.single.unheldSnap]}
          sidePanel={true}
        />
          <LocationDisplay />
        </>,
      );

      expect(container).toHaveTexts(formUnheldSnapButtons);
    });

    it("does not render switch channel button for multiple snaps in sidepanel", () => {
      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(
            installedSnaps,
            mixedSelectedSnapIds,
          )}
          selectedSnapIds={mixedSelectedSnapIds}
          sidePanel={true}
        />
          <LocationDisplay />
        </>,
      );

      expect(
        screen.queryByRole("button", { name: "Switch channel" }),
      ).not.toBeInTheDocument();
    });

    it("opens install snaps side panel from table actions", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(installedSnaps, snapData.empty)}
          selectedSnapIds={snapData.empty}
        />
          <LocationDisplay />
        </>,
      );

      await user.click(screen.getByRole("button", { name: "Install" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=install");
    });

    it("opens hold side panel for selected snaps", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(
            installedSnaps,
            snapData.multiple.unheldSnaps,
          )}
          selectedSnapIds={snapData.multiple.unheldSnaps}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Hold" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=hold");
    });

    it("opens uninstall side panel for selected snaps", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(
            installedSnaps,
            snapData.multiple.unheldSnaps,
          )}
          selectedSnapIds={snapData.multiple.unheldSnaps}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Uninstall" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=uninstall");
    });

    it("opens unhold side panel using held snap count", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(
            installedSnaps,
            mixedSelectedSnapIds,
          )}
          selectedSnapIds={mixedSelectedSnapIds}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Unhold" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=unhold");
    });

    it("opens refresh side panel for selected snaps", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={getSelectedSnaps(
            installedSnaps,
            snapData.multiple.unheldSnaps,
          )}
          selectedSnapIds={snapData.multiple.unheldSnaps}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Refresh" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=refresh");
    });

    it("opens switch channel side panel for held snap in sidepanel mode", async () => {
      const user = userEvent.setup();
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      assert(heldSnap);

      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={[heldSnap]}
          selectedSnapIds={[heldSnap.snap.id]}
          sidePanel={true}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Switch channel" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=switch");
    });

    it("opens uninstall side panel with single snap title in sidepanel mode", async () => {
      const user = userEvent.setup();
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      assert(heldSnap);

      renderWithProviders(
        <>
          <SnapsActions
          installedSnaps={[heldSnap]}
          selectedSnapIds={[heldSnap.snap.id]}
          sidePanel={true}
        />
          <LocationDisplay />
        </>,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      await user.click(screen.getByRole("button", { name: "Uninstall" }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=uninstall");
    });
  });
});
