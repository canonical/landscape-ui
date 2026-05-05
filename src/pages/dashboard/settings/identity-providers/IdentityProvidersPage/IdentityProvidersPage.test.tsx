import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens side panel with provider list when clicking Add identity provider", async () => {
    renderWithProviders(<IdentityProvidersPage />);

    const addButton = await screen.findByRole("button", {
      name: "Add identity provider",
    });
    await userEvent.click(addButton);

    expect(
      screen.getByText(/choose an identity provider/i),
    ).toBeInTheDocument();
  });
});
