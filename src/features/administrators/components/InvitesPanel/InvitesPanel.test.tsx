import { renderWithProviders } from "@/tests/render";
import InvitesPanel from "./InvitesPanel";
import { screen, within } from "@testing-library/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { invitations } from "@/tests/mocks/invitations";
import userEvent from "@testing-library/user-event";

describe("InvitesPanel", () => {
  const user = userEvent.setup();

  it("renders InvitesPanel", async () => {
    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    expect(
      screen.getByText(/Unclaimed invitations expire after 14 days./i),
    ).toBeInTheDocument();
  });

  it("renders the table and columns", async () => {
    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /email/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /invited/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /expires/i }),
    ).toBeInTheDocument();

    for (const invitation of invitations) {
      expect(screen.getByText(invitation.name)).toBeInTheDocument();
    }
  });

  it("renders empty table", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    expect(
      screen.getByText(/you have no unclaimed invitations/i),
    ).toBeInTheDocument();
  });

  it("opens revoke confirmation modal and revokes invitation", async () => {
    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    const revokeButtons = screen.getAllByRole("button", { name: /revoke/i });
    const [revokeButton] = revokeButtons;

    assert(revokeButton);

    await user.click(revokeButton);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", {
      name: /revoke invitation/i,
    });
    await user.click(confirmButton);

    expect(
      await screen.findByText(/you revoked an administrator invite/i),
    ).toBeInTheDocument();
  });

  it("uses correct possessive form for invitation name ending in 's'", async () => {
    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    const invitationEndingInS = invitations.find((inv) =>
      inv.name.endsWith("s"),
    )?.name;

    assert(invitationEndingInS);

    const row = screen.getByText(invitationEndingInS).closest("tr");

    assert(row);

    const revokeButton = within(row).getByRole("button", { name: /revoke/i });
    await user.click(revokeButton);

    const dialog = await screen.findByRole("dialog");
    const confirmButton = within(dialog).getByRole("button", {
      name: /revoke invitation/i,
    });
    await user.click(confirmButton);

    // Success notification appears — the name ends in 's', so no trailing 's' after apostrophe
    await screen.findByText(/you revoked an administrator invite/i);
    expect(
      screen.getByText(
        (text) =>
          text.includes(invitationEndingInS) &&
          text.includes("invitation has been revoked"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText((text) => text.includes(`${invitationEndingInS}'s`)),
    ).not.toBeInTheDocument();
  });

  it("opens resend confirmation modal and resends invitation", async () => {
    renderWithProviders(<InvitesPanel />);

    await expectLoadingState();

    const resendButtons = screen.getAllByRole("button", { name: /resend/i });
    const [resendButton] = resendButtons;

    assert(resendButton);

    await user.click(resendButton);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", {
      name: /resend invitation/i,
    });
    await user.click(confirmButton);

    expect(
      await screen.findByText(/you resent an administrator invite/i),
    ).toBeInTheDocument();
  });
});
