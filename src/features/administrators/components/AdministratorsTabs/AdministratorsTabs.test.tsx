import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AdministratorsTabs from "./AdministratorsTabs";
import { administrators } from "@/tests/mocks/administrators";

describe("AdministratorsTabs", () => {
  it("renders Administrators and Invites tabs", async () => {
    renderWithProviders(
      <AdministratorsTabs
        administrators={administrators}
        handleInvite={vi.fn()}
      />,
    );

    expect(
      await screen.findByRole("link", { name: "Administrators" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Invites" }),
    ).toBeInTheDocument();
  });

  it("switching to Invites tab changes content", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AdministratorsTabs
        administrators={administrators}
        handleInvite={vi.fn()}
      />,
    );

    const invitesTab = await screen.findByRole("link", { name: "Invites" });
    expect(invitesTab).toHaveAttribute("href", "/?tab=invites");
    await user.click(invitesTab);

    expect(await screen.findByText(/ben@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Invites" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("opens the Invites tab from a direct link", async () => {
    renderWithProviders(
      <AdministratorsTabs
        administrators={administrators}
        handleInvite={vi.fn()}
      />,
      undefined,
      "/settings/administrators?tab=invites",
    );

    expect(await screen.findByText(/ben@example.com/i)).toBeInTheDocument();
  });

  it("shows the invitations count badge on the Invites tab", async () => {
    renderWithProviders(
      <AdministratorsTabs
        administrators={administrators}
        invitationsCount={5}
        handleInvite={vi.fn()}
      />,
    );

    const invitesTab = await screen.findByRole("link", { name: /Invites/ });
    expect(invitesTab).toHaveTextContent("5");
  });
});
