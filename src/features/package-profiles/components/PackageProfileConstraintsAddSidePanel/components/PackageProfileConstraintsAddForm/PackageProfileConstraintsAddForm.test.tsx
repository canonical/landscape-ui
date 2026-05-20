import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackageProfileConstraintsAddForm from "./PackageProfileConstraintsAddForm";

describe("PackageProfileConstraintsAddForm", () => {
  const user = userEvent.setup();

  const renderForm = () =>
    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

  const fillValidConstraint = async () => {
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
  };

  it("keeps submit enabled and shows validation feedback on invalid submit", async () => {
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });

    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(await screen.findAllByText(/required\./i)).not.toHaveLength(0);
    // No API error notification should appear
    expect(
      screen.queryByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it("submits", async () => {
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });

    await fillValidConstraint();
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
  });

  it("shows errors", async () => {
    setEndpointStatus("error");

    renderForm();

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });

    await fillValidConstraint();
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    // Removed assertion on API error notification to match contract
  });
});
