import { setEndpointStatus } from "@/tests/controllers/controller";
import { tags } from "@/tests/mocks/tag";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageProfileAddSidePanel from "./PackageProfileAddSidePanel";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("PackageProfileAddSidePanel", () => {
  const user = userEvent.setup();

  const renderForm = async () => {
    renderWithProviders(<PackageProfileAddSidePanel />);
    await screen.findByRole("heading", { name: "Add package profile" });
  };

  const fillValidForm = async () => {
    await user.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Package profile",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      NO_DATA_TEXT,
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Package constraints" }),
      "instance",
    );

    const instanceSelect = screen.getByRole("combobox", { name: "Instance" });
    const availableInstanceOption = within(instanceSelect)
      .getAllByRole("option")
      .find((option) => option.getAttribute("value"));

    if (availableInstanceOption?.getAttribute("value")) {
      await user.selectOptions(
        instanceSelect,
        availableInstanceOption.getAttribute("value") as string,
      );
    } else {
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
    }

    const tagsInput = screen.queryByLabelText("Search and add tags");
    if (tagsInput) {
      await user.click(tagsInput);
      const tagCheckbox = screen.queryByRole("checkbox", { name: tags[0] });
      if (tagCheckbox) {
        await user.click(tagCheckbox);
      }
    }
  };

  it("keeps submit enabled and shows validation feedback on invalid submit", async () => {
    await renderForm();

    const submitButton = screen.getByRole("button", {
      name: "Add package profile",
    });

    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
    // No API error notification should appear
    expect(
      screen.queryByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).not.toBeInTheDocument();
  });

  describe("submit", () => {
    const submitValidForm = async () => {
      const submitButton = screen.getByRole("button", {
        name: "Add package profile",
      });
      expect(submitButton).toBeEnabled();
      await user.click(submitButton);
      expect(await screen.findByText(/profile added/i)).toBeInTheDocument();
    };

    it("submits with all computers", async () => {
      await renderForm();
      await fillValidForm();

      await user.click(
        screen.getByRole("checkbox", { name: "Associate to all instances" }),
      );

      await submitValidForm();
    });

    it("submits with tags", async () => {
      await renderForm();
      await fillValidForm();

      await user.click(screen.getByLabelText("Search and add tags"));
      await user.click(screen.getByRole("checkbox", { name: tags[0] }));

      await submitValidForm();
    });

    it("submits with manual constraints", async () => {
      await renderForm();
      await fillValidForm();

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

      await submitValidForm();
    });
  });

  it("shows errors", async () => {
    setEndpointStatus("error");
    await renderForm();
    await fillValidForm();

    const submitButton = screen.getByRole("button", {
      name: "Add package profile",
    });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
