import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import SnapsList from "./SnapsList";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

async function findSnapByName(name: string) {
  return await screen.findByRole("button", {
    name: `Show details of snap ${name}`,
  });
}

async function clickSnapOnTable(name: string) {
  const snap = await findSnapByName(name);
  await userEvent.click(snap);
}

const snapIds = installedSnaps.map((snap) => snap.snap.id);

const props = {
  instanceId: 1,
  installedSnaps: installedSnaps,
  selectedSnapIds: [],
  isSnapsLoading: false,
  setSelectedSnapIds: vi.fn(),
};

describe("SnapsList", () => {
  beforeEach(() => {
    renderWithProviders(<SnapsList {...props} />);
  });

  it("renders a list of installed snaps", async () => {
    for (let i = 0; i < installedSnaps.length; i++) {
      const snap = await screen.findByRole("button", {
        name: `Show details of snap ${installedSnaps[i].snap.name}`,
      });

      expect(snap).toBeInTheDocument();
    }
  });

  describe("Table Interactions", () => {
    it("shows held snap icon in the snaps table", async () => {
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      expect(heldSnap).toBeDefined();

      const cellWithVersion = screen.getByRole("cell", {
        name: heldSnap!.version,
      });
      const iconElement = cellWithVersion.querySelector("i");

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass("p-icon--pause");
    });

    it("shows version tooltip when hovering on held snap", async () => {
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      expect(heldSnap).toBeDefined();

      if (heldSnap) {
        const cellWithVersion = await screen.findByRole("cell", {
          name: heldSnap.version,
        });
        const versionInfo = cellWithVersion.querySelector("span");
        expect(versionInfo).toBeInTheDocument();

        await userEvent.hover(versionInfo!);
        const tooltip = await screen.findByText("This snap is held");
        expect(tooltip).toBeVisible();
      }
    });

    it("should select all snaps when clicking ToggleAll checkbox", async () => {
      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await userEvent.click(toggleAllCheckbox);

      expect(props.setSelectedSnapIds).toHaveBeenCalledWith(snapIds);
    });

    it.each(snapIds)(
      "should select snap %s when clicking on its row checkbox",
      async (snapId) => {
        const snapCheckbox = await screen.findByRole("checkbox", {
          name: installedSnaps.find((snap) => snap.snap.id === snapId)!.snap
            .name,
        });
        await userEvent.click(snapCheckbox);

        expect(props.setSelectedSnapIds).toHaveBeenCalledWith([snapId]);
      },
    );
  });

  describe("Sidepanel", () => {
    beforeEach(async () => {
      await clickSnapOnTable(installedSnaps[0].snap.name);
    });

    it("should open side panel when snap in table is clicked", async () => {
      const form = await screen.findByRole("complementary");
      const heading = within(form).getByText(
        `${installedSnaps[0].snap.name} details`,
      );
      expect(heading).toBeVisible();
    });

    it("should show side panel action buttons", async () => {
      const buttonsNames = ["Switch channel", "Uninstall", "Hold", "Refresh"];
      const form = await screen.findByRole("complementary");

      buttonsNames.forEach((buttonName) => {
        const button = within(form).getByText(buttonName);
        expect(button).toBeInTheDocument();
      });
    });

    it("should show correct side panel details for a snap", async () => {
      const fieldsToCheck = [
        { label: "snap name", value: installedSnaps[0].snap.name },
        { label: "channel", value: installedSnaps[0].tracking_channel },
        { label: "version", value: installedSnaps[0].version },
        { label: "confinement", value: installedSnaps[0].confinement },
        {
          label: "held until",
          value:
            installedSnaps[0].held_until === null
              ? "-"
              : moment(installedSnaps[0].held_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                ),
        },
        { label: "summary", value: installedSnaps[0].snap.summary ?? "-" },
        {
          label: "publisher",
          value: installedSnaps[0].snap.publisher.username,
        },
      ];
      const form = await screen.findByRole("complementary");
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });
  });
});
