import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AdministratorsPage from "./AdministratorsPage";
import userEvent from "@testing-library/user-event";

describe("AdministratorsPage", () => {
  const user = userEvent.setup();

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

  it("opens invite administrator side panel on button click", async () => {
    renderWithProviders(<AdministratorsPage />);

    const inviteButton = await screen.findByRole("button", {
      name: "Invite administrator",
    });
    await user.click(inviteButton);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    expect(
      within(sidePanel).getByRole("heading", { name: /invite administrator/i }),
    ).toBeInTheDocument();
  });
});
