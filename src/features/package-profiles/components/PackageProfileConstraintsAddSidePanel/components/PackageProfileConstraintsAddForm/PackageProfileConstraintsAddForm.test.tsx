import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PackageProfileConstraintsAddForm from "./PackageProfileConstraintsAddForm";

describe("PackageProfileConstraintsAddForm", () => {
  const user = userEvent.setup();

  it("submits", async () => {
    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });
    expect(submitButton).toBeDisabled();
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
    await user.tab();
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
  });

  it("shows errors", async () => {
    setEndpointStatus("error");

    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });
    expect(submitButton).toBeDisabled();
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
    await user.tab();
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
