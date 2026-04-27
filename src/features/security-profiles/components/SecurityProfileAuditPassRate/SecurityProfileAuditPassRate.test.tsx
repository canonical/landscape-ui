import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SecurityProfileAuditPassRate from "./SecurityProfileAuditPassRate";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import userEvent from "@testing-library/user-event";

const [profile, profileWithRun] = securityProfiles;
describe("SecurityProfileAuditPassRate", () => {
  it("shows no data when there are no results", () => {
    renderWithProviders(<SecurityProfileAuditPassRate profile={profile} />);

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders pass/fail counts and links when counts are non-zero", async () => {
    renderWithProviders(
      <SecurityProfileAuditPassRate profile={profileWithRun} />,
    );

    const results = profileWithRun.last_run_results;

    expect(
      screen.getByRole("link", { name: `${results.passing} passed` }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining(`security-profile%3A${profileWithRun.id}%3Apass`),
    );
    expect(screen.getByText(`${results.failing} failed`)).not.toHaveRole(
      "link",
    );

    await userEvent.hover(screen.getByTestId("passrate-line"));
    const tooltip = await screen.findByRole("tooltip");

    expect(within(tooltip).getByText(/Passed:/)).toBeInTheDocument();
    expect(within(tooltip).getByText(/Failed:/)).toBeInTheDocument();
    expect(within(tooltip).getByText(/In progress:/)).toBeInTheDocument();
    expect(within(tooltip).getByText(/Not run:/)).toBeInTheDocument();

    expect(
      within(tooltip).getByText(`${results.passing} instances (20%)`),
    ).toBeInTheDocument();
    expect(
      within(tooltip).getByText(`${results.in_progress} instances (80%)`),
    ).toBeInTheDocument();
    expect(within(tooltip).getAllByText(`0 instances (0%)`)).toHaveLength(2);
  });
});
