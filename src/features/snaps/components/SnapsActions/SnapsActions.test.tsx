import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { pluralize } from "@/utils/_helpers";
import { afterEach, assert, beforeEach, describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
import { MAX_SELECTED_SNAPS } from "../../constants";
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
const INSTANCE_TITLE = "Application Server 1";

const tableSnapButtons = [
  "Install",
  "Hold",
  "Unhold",
  "Uninstall",
  "Refresh",
  "Change channel",
];
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
    setScreenSize("xl");
  });

  afterEach(() => {
    resetScreenSize();
  });

  describe("Responsive collapse", () => {
    it("collapses the table actions below the xl breakpoint and keeps Install visible", () => {
      setScreenSize("lg");
      renderWithProviders(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

      expect(screen.getByRole("button", { name: "Install" })).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Actions" }),
      ).toBeInTheDocument();
      for (const button of tableSnapButtons.filter((b) => b !== "Install")) {
        expect(
          screen.queryByRole("button", { name: button }),
        ).not.toBeInTheDocument();
      }
    });

    it("keeps the side panel actions expanded at the lg breakpoint", () => {
      assert(snapData.single.unheldSnap);
      setScreenSize("lg");
      const { container } = renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={[snapData.single.unheldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formUnheldSnapButtons);
      expect(
        screen.queryByRole("button", { name: "Actions" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Snap buttons in table", () => {
    it("renders table buttons with the bulk menu's icons", () => {
      const { container } = renderWithProviders(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={snapData.empty}
        />,
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
      expect(screen.getByRole("button", { name: "Change channel" })).toHaveIcon(
        "change-version",
      );
    });

    describe("Check button disabled statuses", () => {
      it("renders disabled buttons when no snaps selected", () => {
        renderWithProviders(
          <SnapsActions
            instanceTitle={INSTANCE_TITLE}
            selectedSnaps={snapData.empty}
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
            instanceTitle={INSTANCE_TITLE}
            selectedSnaps={snapData.multiple.unheldSnaps}
          />,
        );
        const unholdButton = screen.getByRole("button", { name: "Unhold" });
        expect(unholdButton).toHaveAttribute("aria-disabled");
      });

      it("Hold button enabled when only held snaps are selected", () => {
        renderWithProviders(
          <SnapsActions
            instanceTitle={INSTANCE_TITLE}
            selectedSnaps={snapData.multiple.heldSnaps}
          />,
        );
        const holdButton = screen.getByRole("button", { name: "Hold" });
        expect(holdButton).not.toHaveAttribute("aria-disabled");
      });

      it("Hold and Unhold enabled when only held and unheld snaps are selected", () => {
        renderWithProviders(
          <SnapsActions
            instanceTitle={INSTANCE_TITLE}
            selectedSnaps={mixedSelectedSnaps}
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
      assert(snapData.single.heldSnap);
      const { container } = renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
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
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={[snapData.single.unheldSnap]}
          sidePanel={true}
        />,
      );

      expect(container).toHaveTexts(formUnheldSnapButtons);
    });

    it("renders an enabled change channel button for multiple snaps", () => {
      renderWithProviders(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

      const button = screen.getByRole("button", { name: "Change channel" });
      expect(button).not.toHaveAttribute("aria-disabled");
      expect(button).toBeEnabled();
    });

    it("opens change channel side panel for all selected snaps", async () => {
      const user = userEvent.setup();
      // Held and unheld snaps, up to the limit.
      const selectedSnaps = [
        ...snapData.multiple.heldSnaps.slice(0, 2),
        ...snapData.multiple.unheldSnaps,
      ].slice(0, MAX_SELECTED_SNAPS);
      assert(selectedSnaps.length === MAX_SELECTED_SNAPS);
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={selectedSnaps}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Change channel" }));

      expect(
        await screen.findByRole("heading", { name: "Change snap channel" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      for (const snap of selectedSnaps) {
        expect(
          await screen.findByRole("combobox", {
            name: `Snap channel or revision for ${snap.snap.name}`,
          }),
        ).toBeInTheDocument();
      }
    });

    it("shows a limit modal instead of the side panel for more than 10 snaps", async () => {
      const user = userEvent.setup();
      assert(mixedSelectedSnaps.length > MAX_SELECTED_SNAPS);
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Change channel" }));

      const modal = await screen.findByRole("dialog", {
        name: "Snap limit exceeded",
      });
      expect(
        within(modal).getByText(
          "You can only change channels on a maximum of 10 snaps at once.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Change snap channel" }),
      ).not.toBeInTheDocument();

      await user.click(within(modal).getByRole("button", { name: "OK" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("enables the change channel button without waiting for snap info", () => {
      assert(snapData.single.unheldSnap);
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
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
      renderWithProviders(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={snapData.empty}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Install" }));

      expect(
        await screen.findByRole("heading", { name: "Install snaps" }),
      ).toBeInTheDocument();
    });

    it("opens hold side panel for every selected snap, held or not", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Hold" }));

      expect(
        await screen.findByRole("heading", { name: "Hold snaps" }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/^You selected/)).not.toBeInTheDocument();
      await user.click(
        await screen.findByRole("button", {
          name: `Hold ${mixedSelectedSnaps.length} snaps`,
        }),
      );

      // The side panel has no snap list, so check the confirmation modal's
      // first page, which starts with the held snaps.
      const modal = await screen.findByRole("dialog");
      for (const snap of mixedSelectedSnaps.slice(0, DEFAULT_MODAL_PAGE_SIZE)) {
        expect(within(modal).getByText(snap.snap.name)).toBeInTheDocument();
      }
    });

    it("says how many of the selected snaps Unhold applies to", async () => {
      const user = userEvent.setup();
      const { heldSnaps, unheldSnaps } = snapData.multiple;
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Unhold" }));

      expect(
        await screen.findByText(
          `You selected ${mixedSelectedSnaps.length} snaps. This action will:`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `unhold ${pluralize(heldSnaps.length, ["held snap", "held snaps"], "exact")}`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `leave ${pluralize(unheldSnaps.length, ["snap"], "exact")} unheld`,
        ),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", {
          name: `Unhold ${pluralize(heldSnaps.length, ["snap"], "exact")}`,
        }),
      ).toBeInTheDocument();
    });

    it("leaves out the Unhold summary when every selected snap is held", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={snapData.multiple.heldSnaps}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Unhold" }));

      expect(
        await screen.findByRole("heading", { name: /^Unhold / }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/^You selected/)).not.toBeInTheDocument();
    });

    it("opens uninstall side panel for selected snaps", async () => {
      const user = userEvent.setup();
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={snapData.multiple.unheldSnaps}
        />,
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
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={mixedSelectedSnaps}
        />,
      );

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
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={snapData.multiple.unheldSnaps}
        />,
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
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={[snapData.single.heldSnap]}
          sidePanel={true}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Change channel" }));

      const { name } = snapData.single.heldSnap.snap;
      expect(
        await screen.findByRole("heading", {
          name: `Change channel of ${name}`,
        }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("combobox", {
          name: `Snap channel or revision for ${name}`,
        }),
      ).toBeInTheDocument();
    });

    it.each([
      { button: "Uninstall", held: false },
      { button: "Hold", held: false },
      { button: "Unhold", held: true },
      { button: "Refresh", held: false },
    ])(
      "names the snap in the $button title for a single snap",
      async ({ button, held }) => {
        const user = userEvent.setup();
        const snap = held
          ? snapData.single.heldSnap
          : snapData.single.unheldSnap;
        assert(snap);
        renderOnInstancePage(
          <SnapsActions
            instanceTitle={INSTANCE_TITLE}
            selectedSnaps={[snap]}
            sidePanel={true}
          />,
        );

        await user.click(screen.getByRole("button", { name: button }));

        expect(
          await screen.findByRole("heading", {
            name: `${button} ${snap.snap.name}`,
          }),
        ).toBeInTheDocument();
      },
    );

    it("names the snap when it is the only one eligible in a larger selection", async () => {
      const user = userEvent.setup();
      const [heldSnap] = snapData.multiple.heldSnaps;
      assert(heldSnap);
      renderOnInstancePage(
        <SnapsActions
          instanceTitle={INSTANCE_TITLE}
          selectedSnaps={[heldSnap, ...snapData.multiple.unheldSnaps]}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Unhold" }));

      expect(
        await screen.findByRole("heading", {
          name: `Unhold ${heldSnap.snap.name}`,
        }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "Unhold 1 snap" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Snaps to unhold")).not.toBeInTheDocument();
    });
  });
});
