import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
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
  onUpdateVersions: vi.fn(),
  query: "id:1",
};

const versionNames = availableVersions.map(({ name }) => name);

describe("PackageDropdownSearchItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(
      <PackageDropdownSearchItem {...props} action="unhold" />,
    );

    await screen.findByLabelText("Unhold as not installed on 1 instance");

    const [title, ...checkboxes] = await screen.findAllByRole("checkbox");
    await waitFor(() => expect(checkboxes).toHaveLength(5));

    expect(title).toHaveAccessibleName(props.selectedPackage.name);
    expect(title).not.toBeChecked();
    expect(screen.getByRole("button")).toHaveIcon(ICONS.delete);

    for (const checkbox of checkboxes) {
      expect(checkbox).not.toBeChecked();
    }

    await screen.findByText("4 instances don't have this package held");
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(
      <PackageDropdownSearchItem {...props} action="install" />,
    );

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });

  describe("Version Selection", () => {
    it("adds a version when it is selected", async () => {
      renderWithProviders(
        <PackageDropdownSearchItem {...props} action="uninstall" />,
      );

      const [version] = await screen.findAllByRole("checkbox", {
        name: /Uninstall version/i,
      });
      assert(version);

      await user.click(version);
      expect(props.onUpdateVersions).toBeCalledWith([
        availableVersions[0].name,
      ]);
    });

    it("removes a version when it is deselected", async () => {
      const selectedPackage = {
        name: props.selectedPackage.name,
        id: props.selectedPackage.id,
        versions: versionNames,
      };

      renderWithProviders(
        <PackageDropdownSearchItem
          {...props}
          selectedPackage={selectedPackage}
          action="uninstall"
        />,
      );

      const [title, version] = await screen.findAllByRole("checkbox", {
        checked: true,
      });
      expect(title).toHaveAccessibleName(selectedPackage.name);
      assert(version);

      await user.click(version);
      expect(props.onUpdateVersions).toBeCalledWith(versionNames.slice(1));
    });

    it("adds all versions when title is selected", async () => {
      renderWithProviders(
        <PackageDropdownSearchItem {...props} action="install" />,
      );

      const title = await screen.findByRole("checkbox", {
        name: props.selectedPackage.name,
      });

      await user.click(title);
      expect(props.onUpdateVersions).toHaveBeenCalledWith(versionNames);
    });

    it("removes all versions when title is deselected", async () => {
      const selectedPackage = {
        name: props.selectedPackage.name,
        id: props.selectedPackage.id,
        versions: versionNames.slice(0, 2),
      };

      renderWithProviders(
        <PackageDropdownSearchItem
          {...props}
          selectedPackage={selectedPackage}
          action="hold"
        />,
      );

      await screen.findByLabelText("Hold as not installed on 1 instance");

      const title = await screen.findByRole("checkbox", {
        name: selectedPackage.name,
      });
      expect(title).toBePartiallyChecked();

      await user.click(title);
      expect(props.onUpdateVersions).toHaveBeenCalledWith([]);
    });
  });
});
