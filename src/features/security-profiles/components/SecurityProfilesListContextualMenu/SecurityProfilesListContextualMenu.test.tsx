import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import SecurityProfilesListContextualMenu from "./SecurityProfileListContextualMenu";

describe("SecurityProfileListContextualMenu", () => {
  beforeEach(() => {
    renderWithProviders(
      <SecurityProfilesListContextualMenu
        profile={{ ...securityProfiles[0], status: "active" }}
        actions={{
          archive: () => {},
          downloadAudit: () => {},
          duplicate: () => {},
          edit: () => {},
          run: () => {},
          viewDetails: () => {},
        }}
      />,
    );
  });

  it("should render security profiles contextual menu", async () => {
    expect(
      screen.getByLabelText(`${securityProfiles[0].title} profile actions`),
    ).toBeInTheDocument();
    const buttonLabels = [
      "View details",
      "Download audit",
      "Edit",
      "Run",
      "Duplicate profile",
      "Archive",
    ];

    const button = screen.getByLabelText(
      `${securityProfiles[0].title} profile actions`,
    );

    await userEvent.click(button);

    expect(
      screen.queryAllByLabelText(new RegExp(securityProfiles[0].title)),
    ).toHaveLength(7);

    await waitFor(() => {
      buttonLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });
});
