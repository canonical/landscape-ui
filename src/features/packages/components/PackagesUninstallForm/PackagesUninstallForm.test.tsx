import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesUninstallForm from "./PackagesUninstallForm";

const instanceId = 1;

describe("PackagesUninstallForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with package search dropdown and buttons", () => {
      renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

      expect(screen.getByRole("searchbox")).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

      expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
    });
  });

  describe("Form submission", () => {
    it("enables next button when packages are selected", async () => {
      const packages = getInstancePackages(instanceId);
      const [firstPackage] = packages;

      renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const packageOption = await screen.findByText(firstPackage.name);
      await user.click(packageOption);

      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });

    it("submits form and shows success notification for single package", async () => {
      const packages = getInstancePackages(instanceId);
      const [firstPackage] = packages;

      renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const packageOption = await screen.findByText(firstPackage.name);
      await user.click(packageOption);

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      const uninstallButton = screen.getByRole("button", {
        name: "Uninstall 1 package",
      });
      await user.click(uninstallButton);

      expect(
        await screen.findByText(
          new RegExp(
            `You queued package ${firstPackage.name} to be uninstalled`,
            "i",
          ),
        ),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: "Details" }),
      ).toBeInTheDocument();
    });

    it("submits form and shows success notification for multiple packages", async () => {
      const packages = getInstancePackages(instanceId);
      const [firstPackage, secondPackage] = packages;

      renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const firstOption = await screen.findByText(firstPackage.name);
      await user.click(firstOption);

      await user.type(searchBox, secondPackage.name);

      const secondOption = await screen.findByText(secondPackage.name);
      await user.click(secondOption);

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      const uninstallButton = screen.getByRole("button", {
        name: "Uninstall 2 packages",
      });
      await user.click(uninstallButton);

      expect(
        await screen.findByText("You queued 2 packages to be uninstalled."),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: "Details" }),
      ).toBeInTheDocument();
    });
  });

  it("has a back button in the summary page", async () => {
    const packages = getInstancePackages(instanceId);
    const [firstPackage] = packages;

    renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);

    const packageOption = await screen.findByText(firstPackage.name);
    await user.click(packageOption);

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    const backButton = screen.getByRole("button", {
      name: "Back",
    });
    await user.click(backButton);

    expect(nextButton).toBeEnabled();
  });

  it("allows removing selected packages", async () => {
    const packages = getInstancePackages(instanceId);
    const [firstPackage] = packages;

    renderWithProviders(<PackagesUninstallForm instanceIds={[instanceId]} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);

    const packageOption = await screen.findByText(firstPackage.name);
    await user.click(packageOption);

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${firstPackage.name}`,
    });
    await user.click(deleteButton);

    expect(
      screen.queryByRole("button", { name: `Delete ${firstPackage.name}` }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
