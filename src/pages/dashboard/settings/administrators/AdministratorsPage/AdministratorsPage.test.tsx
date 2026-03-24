import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AdministratorsPage from "./AdministratorsPage";

describe("AdministratorsPage", () => {
  it("renders Administrators heading", async () => {
    renderWithProviders(<AdministratorsPage />);

    expect(
      await screen.findByRole("heading", { name: "Administrators" }),
    ).toBeInTheDocument();
  });

  it("renders Invite administrator button", async () => {
    renderWithProviders(<AdministratorsPage />);

    expect(
      await screen.findByRole("button", { name: "Invite administrator" }),
    ).toBeInTheDocument();
  });
});
