import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AdministratorsTabs from "./AdministratorsTabs";
import { administrators } from "@/tests/mocks/administrators";

describe("AdministratorsTabs", () => {
  it("renders Administrators and Invites tabs", async () => {
    renderWithProviders(<AdministratorsTabs administrators={administrators} />);

    expect(
      await screen.findByRole("tab", { name: "Administrators" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("tab", { name: "Invites" }),
    ).toBeInTheDocument();
  });

  it("switching to Invites tab changes content", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdministratorsTabs administrators={administrators} />);

    const invitesTab = await screen.findByRole("tab", { name: "Invites" });
    await user.click(invitesTab);

    expect(await screen.findByText(/ben@example.com/i)).toBeInTheDocument();
  });
});
