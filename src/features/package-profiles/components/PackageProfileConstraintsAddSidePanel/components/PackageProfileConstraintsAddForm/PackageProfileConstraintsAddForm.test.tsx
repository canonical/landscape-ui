import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PackageProfileConstraintsAddForm from "./PackageProfileConstraintsAddForm";

describe("PackageProfileConstraintsAddForm", () => {
  it("submits", async () => {
    renderWithProviders(
      <PackageProfileConstraintsAddForm profile={packageProfiles[0]} />,
    );

    const submitButton = screen.getByRole("button", {
      name: `Add constraint to "${packageProfiles[0].title}" profile`,
    });
    expect(submitButton).toBeDisabled();
    await userEvent.tab();
    await userEvent.selectOptions(
      screen.getByRole("combobox", {
        name: "Constraint",
      }),
      "conflicts",
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Package name",
      }),
      "package",
    );
    await userEvent.tab();
    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);
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
    await userEvent.tab();
    await userEvent.selectOptions(
      screen.getByRole("combobox", {
        name: "Constraint",
      }),
      "conflicts",
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Package name",
      }),
      "package",
    );
    await userEvent.tab();
    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);
    expect(
      await screen.findByText("Request failed with status code 500"),
    ).toBeInTheDocument();
  });
});
