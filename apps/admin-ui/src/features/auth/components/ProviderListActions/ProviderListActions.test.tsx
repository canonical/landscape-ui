import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ProviderListActions from "./ProviderListActions";
import { identityProviders } from "@/tests/mocks/identityProviders";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ProviderListActions", () => {
  beforeEach(() => {
    renderWithProviders(
      <ProviderListActions
        canBeDisabled={false}
        provider={identityProviders[0]}
      />,
    );
  });

  it("should render correctly", async () => {
    expect(screen.getByRole("button")).toHaveAccessibleName(
      `${identityProviders[0].name} provider actions`,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Delete ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
  });

  it("should open edit dialog", async () => {
    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(
      screen.getByRole("button", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
  });
});
