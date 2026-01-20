import { availableVersions, selectedPackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesActionForm from "./PackagesActionForm";

const instanceId = 1;

const [firstPackage, secondPackage] = selectedPackages;

const versionLabel = (content: string) =>
  content.includes(availableVersions[0]?.name ?? "");

describe("PackagesActionForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with searchbox and buttons", () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="install" />,
      );

      screen.getByRole("searchbox");

      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

      expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
    });
  });

  describe("Form submission", () => {
    it("enables next button when package and version are selected", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="install" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      const packageOption = await screen.findByRole("option", {
        name: firstPackage.name,
      });
      await user.click(packageOption);

      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton).toBeDisabled();

      const firstCheckbox = screen.getByRole("checkbox", {
        name: versionLabel,
      });
      await user.click(firstCheckbox);

      expect(nextButton).toBeEnabled();
    });

    it("submits form and shows success notification for single package", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="uninstall" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      const packageOption = await screen.findByText(firstPackage.name);
      await user.click(packageOption);
      const firstCheckbox = screen.getByRole("checkbox", {
        name: versionLabel,
      });
      await user.click(firstCheckbox);

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      const uninstallButton = screen.getByRole("button", {
        name: "Uninstall 1 package",
      });
      await user.click(uninstallButton);

      expect(
        await screen.findByText(
          `You queued package ${firstPackage.name} to be uninstalled`,
          { exact: false },
        ),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: "Details" }),
      ).toBeInTheDocument();
    });

    it("submits form and shows success notification for multiple packages", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="hold" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      const firstOption = await screen.findByText(firstPackage.name);
      await user.click(firstOption);
      const firstCheckbox = screen.getByRole("checkbox", {
        name: versionLabel,
      });
      await user.click(firstCheckbox);

      await user.type(searchBox, secondPackage.name);
      const secondOption = await screen.findByText(secondPackage.name);
      await user.click(secondOption);
      const secondCheckbox = screen.getByRole("checkbox", {
        checked: false,
        name: versionLabel,
      });
      await user.click(secondCheckbox);

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      const installButton = screen.getByRole("button", {
        name: "Hold 2 packages",
      });
      await user.click(installButton);

      expect(
        await screen.findByText("You queued 2 packages to be held."),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: "Details" }),
      ).toBeInTheDocument();
    });
  });

  it("has a back button in the summary page", async () => {
    renderWithProviders(
      <PackagesActionForm instanceIds={[instanceId]} action="hold" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);
    const packageOption = await screen.findByText(firstPackage.name);
    await user.click(packageOption);
    const firstCheckbox = screen.getByRole("checkbox", { name: versionLabel });
    await user.click(firstCheckbox);

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);
    const backButton = screen.getByRole("button", { name: "Back" });
    await user.click(backButton);

    expect(nextButton).toBeEnabled();
  });

  it("allows removing selected packages", async () => {
    renderWithProviders(
      <PackagesActionForm instanceIds={[instanceId]} action="unhold" />,
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

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
