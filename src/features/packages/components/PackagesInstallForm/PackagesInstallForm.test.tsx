import { ROUTES } from "@/libs/routes";
import { getInstancePackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesInstallForm from "./PackagesInstallForm";

const instanceId = 1;
const instancePageUrl = ROUTES.instances.details.single(instanceId);
const instancePath = `${ROUTES.instances.root()}/:instanceId`;

describe("PackagesInstallForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with package search dropdown", () => {
      renderWithProviders(
        <PackagesInstallForm />,
        {},
        instancePageUrl,
        instancePath,
      );

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
      const installButton = screen.getByRole("button", {
        name: "Install packages",
      });
      expect(installButton).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("install button is disabled when no packages selected", () => {
      renderWithProviders(
        <PackagesInstallForm />,
        {},
        instancePageUrl,
        instancePath,
      );

      const installButton = screen.getByRole("button", {
        name: "Install packages",
      });
      expect(installButton).toBeDisabled();
    });
  });

  describe("Form submission", () => {
    it("enables install button when packages are selected", async () => {
      const packages = getInstancePackages(instanceId);
      const [firstPackage] = packages;
      assert(firstPackage);

      renderWithProviders(
        <PackagesInstallForm />,
        {},
        instancePageUrl,
        instancePath,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const packageOption = await screen.findByText(firstPackage.name);
      await user.click(packageOption);

      const installButton = screen.getByRole("button", {
        name: "Install packages",
      });
      expect(installButton).toBeEnabled();
    });

    it("submits form and shows success notification for single package", async () => {
      const packages = getInstancePackages(instanceId);
      const [firstPackage] = packages;
      assert(firstPackage);

      renderWithProviders(
        <PackagesInstallForm />,
        {},
        instancePageUrl,
        instancePath,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const packageOption = await screen.findByText(firstPackage.name);
      await user.click(packageOption);

      const installButton = screen.getByRole("button", {
        name: "Install packages",
      });
      await user.click(installButton);

      expect(
        await screen.findByText(
          new RegExp(
            `You queued package ${firstPackage.name} to be installed`,
            "i",
          ),
        ),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: "Details" }),
      ).toBeInTheDocument();
    });
  });

  it("allows removing selected packages", async () => {
    const packages = getInstancePackages(instanceId);
    const [firstPackage] = packages;
    assert(firstPackage);

    renderWithProviders(
      <PackagesInstallForm />,
      {},
      instancePageUrl,
      instancePath,
    );

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

    const installButton = screen.getByRole("button", {
      name: "Install packages",
    });
    expect(installButton).toBeDisabled();
  });
});
