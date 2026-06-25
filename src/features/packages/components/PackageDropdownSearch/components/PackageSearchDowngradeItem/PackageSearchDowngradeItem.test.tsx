import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageSearchDowngradeItem from "./PackageSearchDowngradeItem";
import { ICONS } from "@canonical/react-components";
import userEvent from "@testing-library/user-event";
import { downgradeVersions } from "@/tests/mocks/packages";

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

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const availableDowngrades = downgradeVersions.flatMap(
  ({ name: source, downgrades }) =>
    downgrades.map(({ name }) => ({ source: source, name: name })),
);

describe("PackageSearchDowngradeItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    screen.getByText(props.selectedPackage.name);
    expect(
      screen.getByRole("button", {
        name: `Delete ${props.selectedPackage.name}`,
      }),
    ).toHaveIcon(ICONS.delete);

    for (const version of downgradeVersions) {
      await screen.findByText(`have version ${version.name} installed`, {
        exact: false,
      });
    }
    const versionButtons = await screen.findAllByRole("button", {
      name: "Don't downgrade",
    });
    screen.getByText("4 instances don't have this package installed");

    expect(versionButtons).toHaveLength(downgradeVersions.length);
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${props.selectedPackage.name}`,
    });
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });

  it("shows only don't downgrade option when no versions are available", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    const [, , lastButton] = await screen.findAllByRole("button", {
      name: "Don't downgrade",
    });
    assert(lastButton);
    await user.click(lastButton);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveAccessibleName("Don't downgrade");
  });

  describe("Version Selection", () => {
    it("adds a version when it is selected", async () => {
      renderWithProviders(<PackageSearchDowngradeItem {...props} />);

      const [versionButton] = await screen.findAllByRole("button", {
        name: "Don't downgrade",
      });
      assert(versionButton);
      await user.click(versionButton);

      const [version] = availableDowngrades;
      assert(version);
      const selection = await screen.findByRole("option", {
        name: (text) => text.startsWith(version.name),
      });
      await user.click(selection);

      expect(props.onUpdateVersions).toBeCalledWith([
        {
          name: version.name,
          source: version.source,
        },
      ]);
    });

    it("adds all versions when latest downgradable is selected", async () => {
      renderWithProviders(<PackageSearchDowngradeItem {...props} />);

      const [versionButton] = await screen.findAllByRole("button", {
        name: "Don't downgrade",
      });
      assert(versionButton);
      await user.click(versionButton);

      const selection = await screen.findByRole("option", {
        name: "Latest downgrade",
      });
      await user.click(selection);

      const selectedDowngrades = availableDowngrades.filter(
        ({ source }) => source == availableDowngrades[0]?.source,
      );
      expect(props.onUpdateVersions).toBeCalledWith(selectedDowngrades);
    });

    it("removes a version when it is deselected", async () => {
      const [version] = availableDowngrades;
      assert(version);

      const selectedPackage = {
        ...props.selectedPackage,
        versions: [version],
      };

      renderWithProviders(
        <PackageSearchDowngradeItem
          {...props}
          selectedPackage={selectedPackage}
        />,
      );

      const versionButton = await screen.findByRole("button", {
        name: version.name,
      });
      await user.click(versionButton);

      const selection = await screen.findByRole("option", {
        name: "Don't downgrade",
      });
      await user.click(selection);

      expect(props.onUpdateVersions).toBeCalledWith([]);
    });
  });
});
