import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import USGProfileLastRunWithSchedule from "./USGProfileLastRunWithSchedule";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import userEvent from "@testing-library/user-event";

const [profile, profileWithRuns] = usgProfiles;

describe("USGProfileLastRunWithSchedule", () => {
  const user = userEvent.setup();

  it("renders no-data placeholder when runs are missing", async () => {
    renderWithProviders(<USGProfileLastRunWithSchedule profile={profile} />);

    const lastRun = screen.getByLabelText(
      `Last run for ${profile.title} profile`,
    );
    expect(lastRun).toHaveTextContent(NO_DATA_TEXT);
    expect(
      screen.getByLabelText(`Schedule for ${profile.title} profile`),
    ).toHaveTextContent("Recurring");

    await user.hover(lastRun);

    const tooltip = await screen.findByRole("tooltip");

    expect(within(tooltip).getByText(/Last run:/)).toBeInTheDocument();
    expect(within(tooltip).getByText(/Next run:/)).toBeInTheDocument();
    expect(within(tooltip).getByText(/Schedule:/)).toBeInTheDocument();
    expect(
      within(tooltip).getByText("Recurring, every 7 days"),
    ).toBeInTheDocument();
    expect(within(tooltip).getAllByText(NO_DATA_TEXT)).toHaveLength(2);
  });

  it("renders formatted last run and schedule labels", async () => {
    renderWithProviders(
      <USGProfileLastRunWithSchedule profile={profileWithRuns} />,
    );

    const lastRun = screen.getByText("May 15, 2024, 15:47");
    expect(screen.getByText("On a date"));

    await user.hover(lastRun);

    const tooltip = await screen.findByRole("tooltip");
    expect(
      within(tooltip).getByText("May 15, 2024, 15:47 UTC"),
    ).toBeInTheDocument();
    expect(
      within(tooltip).getByText("Sep 15, 2024, 15:47 UTC"),
    ).toBeInTheDocument();
    expect(within(tooltip).getByText("On a date")).toBeInTheDocument();
  });

  it.each([
    ["2026-12-31T05:00:00", "2026-12-30T04:00:00"],
    ["2026-12-31T05:00:00Z", "2026-12-30T04:00:00Z"],
    ["2026-12-31T14:00:00+09:00", "2026-12-30T13:00:00+09:00"],
  ])("displays API timestamps %s in UTC", async (nextRun, lastRun) => {
    const utcProfile = {
      ...profileWithRuns,
      next_run_time: nextRun,
      last_run_results: {
        ...profileWithRuns.last_run_results,
        timestamp: lastRun,
      },
    };
    renderWithProviders(<USGProfileLastRunWithSchedule profile={utcProfile} />);

    const lastRunLabel = screen.getByLabelText(
      `Last run for ${utcProfile.title} profile`,
    );
    expect(lastRunLabel).toHaveTextContent("Dec 30, 2026, 04:00");
    await user.hover(lastRunLabel);

    const tooltip = await screen.findByRole("tooltip");
    expect(
      within(tooltip).getByText("Dec 31, 2026, 05:00 UTC"),
    ).toBeInTheDocument();
    expect(
      within(tooltip).getByText("Dec 30, 2026, 04:00 UTC"),
    ).toBeInTheDocument();
  });
});
