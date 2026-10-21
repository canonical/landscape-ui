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
        <PackagesActionForm instanceIds={[instanceId]} actionType="install" />,
      );

      screen.getByRole("searchbox");

      expect(screen.getByRole("button", { name: "Next" })).not.toHaveAttribute(
        "aria-disabled",
      );

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    it("shows error and blocks next step when no package or version is selected", async () => {
      renderWithProviders(
        <PackagesActionForm
          instanceIds={[instanceId]}
          actionType="change_version"
        />,
      );

      const searchBox = screen.getByRole("searchbox");
      const nextButton = screen.getByRole("button", { name: "Next" });

      await user.click(nextButton);

      expect(screen.getByText(/at least one package/i)).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: /Summary/i }),
      ).not.toBeInTheDocument();

      await user.type(searchBox, `${firstPackage.name}`);
      await user.click(
        await screen.findByRole("option", {
          name: new RegExp(firstPackage.name),
        }),
      );

      await user.click(nextButton);

      expect(
        screen.getByText(
          /All selected packages must have at least one version/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: /Summary/i }),
      ).not.toBeInTheDocument();
    });

    it("unblocks next step when at least 1 package is selected", async () => {
      renderWithProviders(
        <PackagesActionForm instanceIds={[instanceId]} actionType="install" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, `${firstPackage.name}`);
      await user.click(await screen.findByText(firstPackage.name));

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(
        screen.queryByText(/at least one package/i),
      ).not.toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: /back/i }),
      ).toBeInTheDocument();
    });

    it("unblocks next step when all packages have versions for change version", async () => {
      renderWithProviders(
        <PackagesActionForm
          instanceIds={[instanceId]}
          actionType="change_version"
        />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.type(searchBox, `${firstPackage.name}`);
      await user.click(await screen.findByText(firstPackage.name));

      await user.click(
        await screen.findByRole("combobox", { name: "Version" }),
      );
      await user.click(await screen.findByRole("checkbox"));

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(
        screen.queryByText(/at least one version/i),
      ).not.toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: /back/i }),
      ).toBeInTheDocument();
    });
  });

  it("allows removing selected packages", async () => {
    renderWithProviders(
      <PackagesActionForm instanceIds={[instanceId]} actionType="unhold" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, firstPackage.name);

    expect(
      screen.queryByRole("checkbox", { name: firstPackage.name }),
    ).not.toBeInTheDocument();
  });
});
