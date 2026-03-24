import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import IdentityProvidersPage from "./IdentityProvidersPage";

describe("IdentityProvidersPage", () => {
  it("renders Identity Providers heading", async () => {
    renderWithProviders(<IdentityProvidersPage />);

    expect(
      await screen.findByRole("heading", { name: "Identity Providers" }),
    ).toBeInTheDocument();
  });

  it("renders Add identity provider button", async () => {
    renderWithProviders(<IdentityProvidersPage />);

    expect(
      await screen.findByRole("button", { name: "Add identity provider" }),
    ).toBeInTheDocument();
  });
});
