import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageProfileConstraintsAddForm from "./PackageProfileConstraintsAddForm";

describe("PackageProfileConstraintsAddForm", () => {
  const renderForm = () =>
    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

  it("keeps submit enabled and shows validation feedback on invalid submit", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });

    expect(submitButton).not.toHaveAttribute("aria-disabled", "true");
    await user.click(submitButton);

    expect(await screen.findAllByText(/required\./i)).not.toHaveLength(0);
    // No API error notification should appear
    expect(
      screen.queryByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it("submits", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });

    // Let the form's validateOnMount pass settle before editing fields;
    // otherwise it races the field-change validations and leaves a stuck
    // "Required." error that blocks submission.
    await user.tab();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Constraint" }),
      "conflicts",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Package name" }),
      "package",
    );

    expect(submitButton).not.toHaveAttribute("aria-disabled");
    await user.click(submitButton);

    expect(await screen.findByText(/added successfully/i)).toBeInTheDocument();
  });

  it("shows errors", async () => {
    const user = userEvent.setup();
    setEndpointStatus("error");

    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });
    await user.tab();
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
    expect(submitButton).not.toHaveAttribute("aria-disabled");
    await user.click(submitButton);
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
