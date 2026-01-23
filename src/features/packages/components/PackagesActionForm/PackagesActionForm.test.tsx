import { availableVersions, selectedPackages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesActionForm from "./PackagesActionForm";

const instanceId = 1;

const [firstPackage, secondPackage] = selectedPackages;

const versionLabel = (content: string) =>
  content.includes(availableVersions[0].name);

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

    it("enables next button when package and version are selected", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="install" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      await user.click(screen.getByRole("option", { name: firstPackage.name }));

      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton).toBeDisabled();

      await user.click(screen.getByRole("checkbox", { name: versionLabel }));

      expect(nextButton).toBeEnabled();
    });

    it("has a back button after the first page", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="hold" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      await user.click(screen.getByRole("option", { name: firstPackage.name }));
      await user.click(screen.getByRole("checkbox", { name: versionLabel }));

      await user.click(screen.getByRole("button", { name: "Next" }));
      const backButton = screen.getByRole("button", { name: "Back" });
      expect(backButton).toBeEnabled();

      await user.click(screen.getByRole("button", { name: "Next" }));
      const secondBackButton = screen.getByRole("button", { name: "Back" });
      expect(secondBackButton).toBeEnabled();
    });

    it("shows summary and scheduling options", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="unhold" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      await user.click(screen.getByRole("option", { name: firstPackage.name }));
      await user.click(screen.getByRole("checkbox", { name: versionLabel }));

      await user.click(screen.getByRole("button", { name: "Next" }));
      screen.getByText(/will unhold/i);

      await user.click(screen.getByRole("button", { name: "Next" }));
      screen.getByText(/delivery time/i);
      screen.getByText(/randomize delivery/i);
    });
  });

  describe("Form submission", () => {
    it("submits form and shows success notification for single package", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="uninstall" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      await user.click(screen.getByRole("option", { name: firstPackage.name }));
      await user.click(screen.getByRole("checkbox", { name: versionLabel }));

      await user.click(screen.getByRole("button", { name: "Next" }));
      await user.click(screen.getByRole("button", { name: "Next" }));

      await user.click(
        screen.getByRole("button", { name: "Uninstall 1 package" }),
      );

      await screen.findByText(
        `You queued package ${firstPackage.name} to be uninstalled`,
        { exact: false },
      );
      screen.getByRole("button", { name: "Details" });
    });

    it("submits form and shows success notification for multiple packages", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="hold" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);
      await user.click(screen.getByRole("option", { name: firstPackage.name }));
      await user.click(screen.getByRole("checkbox", { name: versionLabel }));

      await user.type(searchBox, secondPackage.name);
      await user.click(
        screen.getByRole("option", { name: secondPackage.name }),
      );
      await user.click(
        screen.getByRole("checkbox", { checked: false, name: versionLabel }),
      );

      await user.click(screen.getByRole("button", { name: "Next" }));
      await user.click(screen.getByRole("button", { name: "Next" }));

      await user.click(screen.getByRole("button", { name: "Hold 2 packages" }));

      await screen.findByText("You queued 2 packages to be held.");
      screen.getByRole("button", { name: "Details" });
    });
  });

  it("allows removing selected packages", async () => {
    renderWithProviders(
      <PackagesActionForm instanceIds={[instanceId]} action="unhold" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);
    await user.click(screen.getByRole("option", { name: firstPackage.name }));

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${firstPackage.name}`,
    });
    await user.click(deleteButton);

    expect(
      screen.queryByRole("checkbox", { name: firstPackage.name }),
    ).not.toBeInTheDocument();
  });
});
