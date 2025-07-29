import { describe } from "vitest";
import ProviderForm from "./ProviderForm";
import { renderWithProviders } from "@/tests/render";
import type { IdentityProvider } from "../../types";
import { screen, waitFor } from "@testing-library/react";
import {
  identityProviders,
  singleIdentityProviders,
  supportedProviders,
} from "@/tests/mocks/identityProviders";
import userEvent from "@testing-library/user-event";

const ubuntuOneProvider: IdentityProvider = {
  name: "Ubuntu One",
  provider: "ubuntu-one",
  enabled: true,
  id: 100,
};

describe("ProviderForm", () => {
  it("should render correctly when action is add", async () => {
    renderWithProviders(
      <ProviderForm action="add" provider={supportedProviders[0]} />,
    );

    expect(screen.getByText("Callback URL")).toBeInTheDocument();

    expect(
      screen.getByText(
        "You will need to set this in the configuration of your identity provider.",
      ),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("textbox")).toHaveLength(4);

    await userEvent.click(
      screen.getByRole("button", { name: "Add ID provider" }),
    );

    expect(await screen.findAllByText("This field is required")).toHaveLength(
      4,
    );
  });

  it("should render correctly when action is edit", async () => {
    renderWithProviders(
      <ProviderForm
        action="edit"
        provider={identityProviders[0]}
        canBeDisabled
      />,
    );

    expect(screen.getByText("Callback URL")).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", { name: "Enabled" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
        singleIdentityProviders[0].configuration.name,
      );
      expect(screen.getByRole("textbox", { name: "Client ID" })).toHaveValue(
        singleIdentityProviders[0].configuration.client_id,
      );
      expect(
        screen.getByRole("textbox", { name: "Client Secret" }),
      ).toHaveValue(singleIdentityProviders[0].configuration.client_secret);
      expect(screen.getByRole("textbox", { name: "Issuer" })).toHaveValue(
        singleIdentityProviders[0].configuration.issuer,
      );
    });
  });

  it("should render enable toggle only for Ubuntu One edit", () => {
    renderWithProviders(
      <ProviderForm action="edit" provider={ubuntuOneProvider} canBeDisabled />,
    );

    expect(screen.queryByText("Callback URL")).not.toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", { name: "Enabled" }),
    ).toBeInTheDocument();

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
