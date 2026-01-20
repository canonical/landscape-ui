import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageDropdownSearchItem from "./PackageDropdownSearchItem";
import { ICONS } from "@canonical/react-components";
import userEvent from "@testing-library/user-event";
import { availableVersions } from "@/tests/mocks/packages";

const props = {
  selectedPackage: {
    name: "libthai0",
    id: 15,
    versions: [],
  },
  onDelete: vi.fn(),
  onSelectVersion: vi.fn(),
  onDeselectVersion: vi.fn(),
  query: "id:1",
};

describe("PackageDropdownSearchItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(
      <PackageDropdownSearchItem {...props} action="uninstall" />,
    );

    screen.getByText(props.selectedPackage.name);
    expect(screen.getByRole("button")).toHaveIcon(ICONS.delete);

    const checkboxes = await screen.findAllByRole("checkbox");
    checkboxes.map((checkbox, index) => {
      screen.getByLabelText(
        `Uninstall version ${availableVersions[index]?.name}`,
        { exact: false },
      );
      expect(checkbox).not.toBeChecked();
    });
  });

  it("calls onDelete function when delete button is clicked", async () => {
    renderWithProviders(
      <PackageDropdownSearchItem {...props} action="install" />,
    );

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });

  it("checks and unchecks when a version is clicked", async () => {
    renderWithProviders(
      <PackageDropdownSearchItem {...props} action="unhold" />,
    );

    const checkboxes = await screen.findAllByRole("checkbox");
    checkboxes.map(async (checkbox) => {
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    screen.getByLabelText(`Unhold as not installed on 1 instance`);
  });
});
