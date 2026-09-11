import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesActionForm from "./PackagesActionForm";
import { packages } from "@/tests/mocks/packages";

const instanceId = 1;

const [firstPackage] = packages;

describe("PackagesActionForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with searchbox and buttons", () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="install" />,
      );

      screen.getByRole("searchbox");

      expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute(
        "aria-disabled",
      );

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    it("enables next button when package and version are selected", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} action="install" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, firstPackage.name);

      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("allows removing selected packages", async () => {
    renderWithProviders(
      <PackagesActionForm instanceIds={[instanceId]} action="unhold" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);

    expect(
      screen.queryByRole("checkbox", { name: firstPackage.name }),
    ).not.toBeInTheDocument();
  });
});
