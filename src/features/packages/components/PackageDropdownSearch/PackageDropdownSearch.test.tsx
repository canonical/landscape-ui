import { selectedPackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import PackageDropdownSearch from "./PackageDropdownSearch";

const props: ComponentProps<typeof PackageDropdownSearch> = {
  selectedPackages: [],
  setSelectedPackages: vi.fn(),
  instanceIds: [],
  action: "install",
};

describe("PackageDropdownSearch", () => {
  const user = userEvent.setup();

  const [selectedPackage] = selectedPackages;
  assert(selectedPackage);

  describe("Search functionality", () => {
    it("opens dropdown when search is clicked", async () => {
      renderWithProviders(<PackageDropdownSearch {...props} />);

      const searchBox = screen.getByRole("searchbox");
      screen.getByText(/search available packages/i);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      await user.click(searchBox);

      screen.getByRole("switch");
      screen.getByText(/\d+ packages/i);
      screen.getByRole("listbox");
    });

    it("shows matching packages after searching", async () => {
      renderWithProviders(<PackageDropdownSearch {...props} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, selectedPackage.name);

      await screen.findByRole("option", { name: selectedPackage.name });
    });

    it("shows message when packages limit is reached", () => {
      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          selectedPackages={selectedPackages}
        />,
      );

      screen.findByText(/maximum of 10 packages/i);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });

    it("clears search input when clear button is clicked", async () => {
      renderWithProviders(<PackageDropdownSearch {...props} />);

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

  describe("Package selection", () => {
    it("adds package to selected items when clicked", async () => {
      renderWithProviders(<PackageDropdownSearch {...props} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, selectedPackage.name);

      const packageItem = await screen.findByRole("option", {
        name: selectedPackage.name,
      });
      await user.click(packageItem);

      expect(props.setSelectedPackages).toHaveBeenCalled();
    });

    it("clears search box after selecting a package", async () => {
      renderWithProviders(<PackageDropdownSearch {...props} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, selectedPackage.name);

      const packageItem = await screen.findByRole("option", {
        name: selectedPackage.name,
      });
      await user.click(packageItem);

      expect(searchBox).toHaveValue("");
    });
  });

  describe("Selected packages display", () => {
    it("shows all selected packages in results list", () => {
      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          selectedPackages={selectedPackages}
        />,
      );

      for (const pkg of selectedPackages) {
        screen.getByRole("checkbox", { name: pkg.name });
      }
    });

    it("shows downgrade item", async () => {
      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          action="downgrade"
          selectedPackages={[selectedPackage]}
        />,
      );

      screen.getByRole("heading", { name: selectedPackage.name });
      await screen.findAllByText("Downgrade to:");
    });

    it("removes package when delete button is clicked", async () => {
      renderWithProviders(
        <PackageDropdownSearch
          {...props}
          selectedPackages={[selectedPackage]}
        />,
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(props.setSelectedPackages).toHaveBeenCalled();
    });
  });
});
