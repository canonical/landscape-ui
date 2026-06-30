import {
  noneLoginMethods,
  oidcOnlyLoginMethods,
  ubuntuOneOnlyLoginMethods,
} from "@/tests/mocks/loginMethods";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import IdentityProvidersContainer from "./IdentityProvidersContainer";

describe("IdentityProvidersContainer", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render loading state", async () => {
    setEndpointStatus({ status: "loading", path: "login/methods" });

    renderWithProviders(<IdentityProvidersContainer />);

    const loadingSpinner = await screen.findByRole("status");
    expect(loadingSpinner).toHaveTextContent("Loading...");
  });

  it("should render empty state when methods are undefined (api error)", async () => {
    setEndpointStatus({ status: "error", path: "login/methods" });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(
      await screen.findByText("No identity providers"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render empty state when no providers are available", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: noneLoginMethods,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(
      await screen.findByText("No identity providers"),
    ).toBeInTheDocument();
  });

  it("should render provider list when Ubuntu One is available", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: ubuntuOneOnlyLoginMethods,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Ubuntu One")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "No identity providers" }),
    ).not.toBeInTheDocument();
  });

  it("should render provider list when OIDC is available and has configurations", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: oidcOnlyLoginMethods,
    });

    renderWithProviders(<IdentityProvidersContainer />);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Okta Enabled")).toBeInTheDocument();
  });
});
