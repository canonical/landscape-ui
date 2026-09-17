import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { ICONS } from "@canonical/react-components";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SnapInstalledItem from "./SnapInstalledItem";

const [selectedSnap] = installedSnaps;

const props: ComponentProps<typeof SnapInstalledItem> = {
  selectedSnap,
  onDelete: vi.fn(),
  isUnhold: false,
  selectedInstances: 5,
};

describe("SnapInstalledItem", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders item with delete button", async () => {
    renderWithProviders(<SnapInstalledItem {...props} />);

    expect(screen.getByText(selectedSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Installed on ${selectedSnap.computerCount} of ${props.selectedInstances} instances`,
      ),
    ).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${selectedSnap.snap.name}`,
    });
    expect(deleteButton).toHaveIcon(ICONS.delete);
  });

  it("deletes item when delete button is clicked", async () => {
    renderWithProviders(<SnapInstalledItem {...props} />);

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });

  it("render held count when the action is unhold", async () => {
    renderWithProviders(<SnapInstalledItem {...props} isUnhold={true} />);

    expect(
      screen.getByText(
        `Held on ${selectedSnap.computerCount} of ${props.selectedInstances} instances`,
      ),
    ).toBeInTheDocument();
  });
});
