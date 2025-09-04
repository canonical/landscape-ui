import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { tags } from "@/tests/mocks/tag";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect } from "vitest";
import PackageProfileAddSidePanel from "./PackageProfileAddSidePanel";

describe("PackageProfileAddSidePanel", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    renderWithProviders(<PackageProfileAddSidePanel />);

    await screen.findByRole("heading", { name: "Add package profile" });
    expect(
      screen.getByRole("button", {
        name: "Add package profile",
      }),
    ).toBeDisabled();
    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Package profile",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      "---",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Package constraints" }),
      "instance",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Instance" }),
      instances[0].id.toString(),
    );
  });

  describe("submit", () => {
    afterEach(async () => {
      const submitButton = screen.getByRole("button", {
        name: "Add package profile",
      });
      expect(submitButton).toBeEnabled();
      await user.click(submitButton);
    });

    it("submits with all computers", async () => {
      await user.click(
        screen.getByRole("checkbox", { name: "Associate to all instances" }),
      );
    });

    it("submits with tags", async () => {
      await user.click(screen.getByLabelText("Search and add tags"));
      await user.click(screen.getByRole("checkbox", { name: tags[0] }));
    });

    it("submits with manual constraints", async () => {
      await user.selectOptions(
        screen.getByRole("combobox", { name: "Package constraints" }),
        "manual",
      );
      await user.selectOptions(
        screen.getByRole("combobox", {
          name: "Constraint",
        }),
        "conflicts",
      );
      await user.type(
        screen.getByRole("textbox", {
          name: "Package name",
        }),
        "package",
      );
      await user.tab();
    });
  });

  it("shows errors", async () => {
    setEndpointStatus("error");
    const submitButton = screen.getByRole("button", {
      name: "Add package profile",
    });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    expect(
      await screen.findByText("Request failed with status code 500"),
    ).toBeInTheDocument();
  });
});
