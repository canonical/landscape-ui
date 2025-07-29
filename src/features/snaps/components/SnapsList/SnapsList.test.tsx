import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { setScreenSize } from "@/tests/helpers";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, expect, vi } from "vitest";
import SnapsList from "./SnapsList";

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
  it("renders a list of installed snaps", async () => {
    renderWithProviders(<SnapsList {...props} />);

    for (const installedSnap of installedSnaps) {
      const snap = await screen.findByRole("button", {
        name: `Show details of snap ${installedSnap.snap.name}`,
      });

      expect(snap).toBeInTheDocument();
    }
  });

  describe("Table Interactions", () => {
    it("shows held snap icon in the snaps table", async () => {
      renderWithProviders(<SnapsList {...props} />);
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      assert(heldSnap);

      const cells = screen.getAllByRole("cell", {
        name: /version/i,
      });

      const cellWithVersion = cells.find((cell) => {
        return cell.textContent === heldSnap.version;
      });

      assert(cellWithVersion);

      expect(cellWithVersion).toHaveIcon("pause");
    });

    it("shows version tooltip when hovering on held snap", async () => {
      renderWithProviders(<SnapsList {...props} />);
      const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
      assert(heldSnap);

      const cells = screen.getAllByRole("cell", {
        name: /version/i,
      });

      const cellWithVersion = cells.find((cell) => {
        return cell.textContent === heldSnap.version;
      });

      assert(cellWithVersion);

      const versionInfo = cellWithVersion.querySelector("span");
      expect(versionInfo).toBeInTheDocument();

      assert(versionInfo);

      await userEvent.hover(versionInfo);
      const tooltip = await screen.findByText("This snap is held");
      expect(tooltip).toBeVisible();
    });

    it("should select all snaps when clicking ToggleAll checkbox", async () => {
      const { rerender } = renderWithProviders(<SnapsList {...props} />);

      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await userEvent.click(toggleAllCheckbox);

      expect(props.setSelectedSnapIds).toHaveBeenCalledWith(snapIds);
      rerender(<SnapsList {...props} selectedSnapIds={snapIds} />);
      const checkedCheckboxes = screen.getAllByRole("checkbox", {
        checked: true,
      });

      expect(checkedCheckboxes).toHaveLength(snapIds.length + 1);
    });

    it("should select snap when clicking on its row checkbox", async () => {
      renderWithProviders(<SnapsList {...props} />);

      const [selectedSnap] = installedSnaps;
      const snapCheckbox = await screen.findByRole("checkbox", {
        name: selectedSnap.snap.name,
      });
      await userEvent.click(snapCheckbox);

      expect(props.setSelectedSnapIds).toHaveBeenCalledWith([
        selectedSnap.snap.id,
      ]);
    });
  });

  describe("Sidepanel", () => {
    const [selectedSnap] = installedSnaps;

    beforeEach(async () => {
      renderWithProviders(<SnapsList {...props} />);

      await clickSnapOnTable(selectedSnap.snap.name);

      setScreenSize("lg");
    });

    it("should open side panel when snap in table is clicked", async () => {
      const form = await screen.findByRole("complementary");
      const heading = within(form).getByText(
        `${selectedSnap.snap.name} details`,
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
        { label: "Name", value: selectedSnap.snap.name },
        { label: "Channel", value: selectedSnap.tracking_channel },
        { label: "Version", value: selectedSnap.version },
        { label: "Confinement", value: selectedSnap.confinement },
        {
          label: "Held until",
          value: moment(selectedSnap.held_until).isValid() ? (
            moment(selectedSnap.held_until).format(DISPLAY_DATE_TIME_FORMAT)
          ) : (
            <NoData />
          ),
        },
        {
          label: "Summary",
          value: selectedSnap.snap.summary ?? <NoData />,
        },
        {
          label: "Publisher",
          value: selectedSnap.snap.publisher.username,
        },
      ];
      const form = await screen.findByRole("complementary");
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });
  });
});
