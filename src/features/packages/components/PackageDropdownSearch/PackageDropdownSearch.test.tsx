import { ROUTES } from "@/libs/routes";
import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageDropdownSearch from "./PackageDropdownSearch";

const instanceId = 1;
const instancePackages = getInstancePackages(instanceId);

const instancePageUrl = ROUTES.instances.details.single(instanceId);
const instancePath = `${ROUTES.instances.root()}/:instanceId`;

const availablePackages = instancePackages.filter(
  (pkg) => pkg.available_version,
);

const props: ComponentProps<typeof PackageDropdownSearch> = {
  selectedPackages: [],
  setSelectedPackages: vi.fn(),
};

describe("PackageDropdownSearch", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    renderWithProviders(
      <PackageDropdownSearch {...props} />,
      undefined,
      instancePageUrl,
      instancePath,
    );
  });

  it("renders package dropdown search component", () => {
    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
    expect(screen.getByText(/min 3\. characters/i)).toBeInTheDocument();
  });

  describe("Search functionality", () => {
    it("shows matching packages after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      assert(availablePackages[0]);
      await user.type(searchBox, availablePackages[0].name);

      const matchingPackage = await screen.findByText(
        availablePackages[0].name,
      );
      expect(matchingPackage).toBeInTheDocument();
    });

    it("shows no packages found message when search yields no results", async () => {
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "nonexistentpackage");

      const errorText = await screen.findByText(
        /No packages found by "nonexistentpackage"/i,
      );
      expect(errorText).toBeInTheDocument();
    });
  });

  describe("Package selection", () => {
    it("adds package to selected items when clicked", async () => {
      assert(availablePackages[0]);
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, availablePackages[0].name);

      const packageItem = await screen.findByText(availablePackages[0].name);
      await user.click(packageItem);

      expect(props.setSelectedPackages).toHaveBeenCalled();
    });

    it("clears search box after selecting a package", async () => {
      assert(availablePackages[0]);
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, availablePackages[0].name);

      const packageItem = await screen.findByText(availablePackages[0].name);
      await user.click(packageItem);

      expect(searchBox).toHaveValue("");
    });
  });

  describe("Clear search functionality", () => {
    it("clears search input when clear button is clicked", async () => {
      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, "test");
      expect(searchBox).toHaveValue("test");

      const clearButton = screen.getByRole("button", {
        name: /clear search field/i,
      });
      await user.click(clearButton);

      expect(searchBox).toHaveValue("");
    });
  });

  describe("Selected packages display", () => {
    it("displays selected packages in the result list", () => {
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      renderWithProviders(
        <PackageDropdownSearch {...props} selectedPackages={[selectedPackage]} />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      expect(screen.getByText(selectedPackage.name)).toBeInTheDocument();
      expect(
        screen.getByText(selectedPackage.available_version ?? ""),
      ).toBeInTheDocument();
    });

    it("removes package when delete button is clicked", async () => {
      const [selectedPackage] = availablePackages;
      assert(selectedPackage);
      renderWithProviders(
        <PackageDropdownSearch {...props} selectedPackages={[selectedPackage]} />,
        undefined,
        instancePageUrl,
        instancePath,
      );

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      assert(deleteButton);
      await user.click(deleteButton);

      expect(props.setSelectedPackages).toHaveBeenCalled();
    });
  });
});
