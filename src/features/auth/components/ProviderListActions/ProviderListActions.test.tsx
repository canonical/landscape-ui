import { beforeEach, describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ProviderListActions from "./ProviderListActions";
import { identityProviders } from "@/tests/mocks/identityProviders";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";

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
      screen.getByRole("menuitem", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", {
        name: `Delete ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
  });

  it("should open edit dialog", async () => {
    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: `Edit ${identityProviders[0].name} provider`,
      }),
    ).toBeInTheDocument();
  });

  it("should open delete confirmation modal when Delete is clicked", async () => {
    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: `Delete ${identityProviders[0].name} provider`,
      }),
    );

    expect(
      screen.getByRole("heading", { name: /delete identity provider/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `This will delete the ${identityProviders[0].name} provider.`,
      ),
    ).toBeInTheDocument();
  });

  it("should close modal after confirming delete", async () => {
    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: `Delete ${identityProviders[0].name} provider`,
      }),
    );

    const deleteButton = screen.getByRole("button", { name: /^delete$/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /delete identity provider/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("should handle delete error gracefully and still close modal", async () => {
    setEndpointStatus({ status: "error", path: "oidc-providers" });

    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: `Delete ${identityProviders[0].name} provider`,
      }),
    );

    const deleteButton = screen.getByRole("button", { name: /^delete$/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /delete identity provider/i }),
      ).not.toBeInTheDocument();
    });
  });
});
