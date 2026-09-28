import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import AdministratorsLimit from "./AdministratorsLimit";

describe("AdministratorsLimit", () => {
  it("renders administrators limit and remaining invitations", () => {
    renderWithProviders(
      <AdministratorsLimit adminAndInviteCount={4} administratorsLimit={20} />,
    );

    expect(screen.getByText("Maximum administrators")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Remaining invitations")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });

  it("shows limit but unknown remaining when admin info errors with a known limit", () => {
    renderWithProviders(
      <AdministratorsLimit
        adminAndInviteCount={4}
        administratorsLimit={20}
        isAdminInfoError
      />,
    );

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Unable to determine")).toBeInTheDocument();
  });

  it("shows unknown limit and remaining when admin info errors without a limit", () => {
    renderWithProviders(
      <AdministratorsLimit
        adminAndInviteCount={4}
        administratorsLimit={0}
        isAdminInfoError
      />,
    );

    expect(screen.getAllByText("Unable to determine")).toHaveLength(2);
  });
});
