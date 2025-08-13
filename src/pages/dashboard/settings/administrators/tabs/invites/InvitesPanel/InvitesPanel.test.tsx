import { renderWithProviders } from "@/tests/render";
import InvitesPanel from "./InvitesPanel";
import { screen } from "@testing-library/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { invitations } from "@/tests/mocks/invitations";

describe("InvitesPanel", () => {
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
});
